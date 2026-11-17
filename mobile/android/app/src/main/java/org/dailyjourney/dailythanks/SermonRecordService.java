package org.dailyjourney.dailythanks;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.SystemClock;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import androidx.core.app.NotificationCompat;
import java.io.File;

/** Foreground service that owns the sermon recording, so it keeps going with the screen off or the app in the background.
 *  Phone calls: while a call only rings, recording continues. If the call is answered, the microphone belongs to the call,
 *  so recording pauses and picks up again by itself when the call ends. AAC mono 22 kHz / 48 kbps (~21 MB an hour). */
public class SermonRecordService extends Service {
    static final String CHANNEL = "sermon_rec";
    static final int NOTE_ID = 7301;

    // One recording at a time; the plugin reads this state directly (same process).
    static volatile String state = "idle";         // idle | recording | paused | interrupted
    static volatile File file;
    static volatile long startedAt, pausedTotal, pausedAt;
    static volatile boolean userPaused;
    static volatile MediaRecorder recorder;
    static volatile Listener listener;
    static String title = "Recording sermon", text = "Recording continues with the screen off.";

    interface Listener { void changed(); }

    private PowerManager.WakeLock wake;
    private AudioManager.OnModeChangedListener modeListener;
    private PhoneStateListener phoneListener;

    @Override public IBinder onBind(Intent i) { return null; }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        Notification n = notification();
        if (Build.VERSION.SDK_INT >= 29) startForeground(NOTE_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE);
        else startForeground(NOTE_ID, n);
        if (recorder == null) {
            try { begin(); } catch (Exception e) { state = "idle"; notifyChanged(); stopSelf(); return START_NOT_STICKY; }
        }
        return START_NOT_STICKY;
    }

    private void begin() throws Exception {
        File dir = new File(getFilesDir(), "sermons"); dir.mkdirs();
        file = new File(dir, "rec-" + (System.currentTimeMillis() / 1000) + ".m4a");
        MediaRecorder r = Build.VERSION.SDK_INT >= 31 ? new MediaRecorder(this) : new MediaRecorder();
        r.setAudioSource(MediaRecorder.AudioSource.MIC);           // with the phone's gain control: preachers move around
        r.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        r.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        r.setAudioChannels(1);
        r.setAudioSamplingRate(22050);
        r.setAudioEncodingBitRate(48000);
        r.setOutputFile(file.getAbsolutePath());
        r.prepare(); r.start();
        recorder = r; state = "recording"; userPaused = false;
        startedAt = SystemClock.elapsedRealtime(); pausedTotal = 0; pausedAt = 0;
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wake = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "dailyjourney:sermon");
        wake.acquire(4 * 60 * 60 * 1000L);   // at most 4 hours
        watchCalls();
        notifyChanged();
    }

    private void watchCalls() {
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (Build.VERSION.SDK_INT >= 31) {
            modeListener = mode -> onCall(mode == AudioManager.MODE_IN_CALL || mode == AudioManager.MODE_IN_COMMUNICATION);
            am.addOnModeChangedListener(getMainExecutor(), modeListener);
        } else {
            TelephonyManager tm = (TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE);
            phoneListener = new PhoneStateListener() {
                @Override public void onCallStateChanged(int s, String number) { onCall(s == TelephonyManager.CALL_STATE_OFFHOOK); }
            };
            try { tm.listen(phoneListener, PhoneStateListener.LISTEN_CALL_STATE); } catch (SecurityException ignored) {}
        }
    }

    // Ringing doesn't count: only an answered call (off-hook / in-call audio mode) pauses the recording.
    private static synchronized void onCall(boolean inCall) {
        MediaRecorder r = recorder; if (r == null) return;
        if (inCall && "recording".equals(state)) { try { r.pause(); } catch (Exception ignored) {} pausedAt = SystemClock.elapsedRealtime(); state = "interrupted"; notifyChanged(); }
        else if (!inCall && "interrupted".equals(state) && !userPaused) { try { r.resume(); } catch (Exception ignored) {} pausedTotal += SystemClock.elapsedRealtime() - pausedAt; state = "recording"; notifyChanged(); }
    }

    static synchronized void pause() {
        MediaRecorder r = recorder; if (r == null || !"recording".equals(state)) return;
        try { r.pause(); } catch (Exception ignored) {}
        userPaused = true; pausedAt = SystemClock.elapsedRealtime(); state = "paused"; notifyChanged();
    }
    static synchronized void resume() {
        MediaRecorder r = recorder; if (r == null || "recording".equals(state)) return;
        userPaused = false;
        try { r.resume(); } catch (Exception ignored) {}
        pausedTotal += SystemClock.elapsedRealtime() - pausedAt; state = "recording"; notifyChanged();
    }
    static double seconds() {
        if (recorder == null) return 0;
        long now = "recording".equals(state) ? SystemClock.elapsedRealtime() : pausedAt;
        return Math.max(0, (now - startedAt - pausedTotal) / 1000.0);
    }
    static double level() {
        MediaRecorder r = recorder;
        if (r == null || !"recording".equals(state)) return 0;
        try { return Math.min(1.0, r.getMaxAmplitude() / 12000.0); } catch (Exception e) { return 0; }
    }

    /** Stops and returns the file (or null). */
    static synchronized File finish(Context ctx) {
        MediaRecorder r = recorder; File f = file;
        recorder = null; state = "idle";
        if (r != null) { try { if (Build.VERSION.SDK_INT >= 24) r.resume(); } catch (Exception ignored) {} try { r.stop(); } catch (Exception ignored) {} r.release(); }
        ctx.stopService(new Intent(ctx, SermonRecordService.class));
        notifyChanged();
        return f;
    }

    private static void notifyChanged() { Listener l = listener; if (l != null) l.changed(); }

    private Notification notification() {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (Build.VERSION.SDK_INT >= 26 && nm.getNotificationChannel(CHANNEL) == null)
            nm.createNotificationChannel(new NotificationChannel(CHANNEL, title, NotificationManager.IMPORTANCE_LOW));
        Intent open = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent pi = PendingIntent.getActivity(this, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        return new NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .setContentTitle(title).setContentText(text)
            .setOngoing(true).setOnlyAlertOnce(true).setContentIntent(pi)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build();
    }

    @Override public void onDestroy() {
        if (wake != null && wake.isHeld()) wake.release();
        AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        if (Build.VERSION.SDK_INT >= 31 && modeListener != null) am.removeOnModeChangedListener(modeListener);
        if (phoneListener != null) { try { ((TelephonyManager) getSystemService(Context.TELEPHONY_SERVICE)).listen(phoneListener, PhoneStateListener.LISTEN_NONE); } catch (Exception ignored) {} }
        super.onDestroy();
    }
}
