package org.dailyjourney.dailythanks;

import android.Manifest;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.content.ContextCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;
import java.io.File;

/** SermonRecorder: start / pause / resume / stop a sermon recording held by SermonRecordService. */
@CapacitorPlugin(name = "SermonRecorder", permissions = {
    @Permission(alias = "microphone", strings = { Manifest.permission.RECORD_AUDIO }),
    @Permission(alias = "notifications", strings = { "android.permission.POST_NOTIFICATIONS" })
})
public class SermonRecorderPlugin extends Plugin {
    @Override public void load() {
        SermonRecordService.listener = () -> new android.os.Handler(android.os.Looper.getMainLooper()).post(() -> notifyListeners("state", info()));
    }

    private JSObject info() {
        JSObject o = new JSObject();
        o.put("state", SermonRecordService.state);
        o.put("seconds", SermonRecordService.seconds());
        o.put("level", SermonRecordService.level());
        File f = SermonRecordService.file;
        o.put("path", f == null ? "" : Uri.fromFile(f).toString());
        return o;
    }

    @PluginMethod public void start(PluginCall call) {
        if (getPermissionState("microphone") != PermissionState.GRANTED) { requestPermissionForAlias("microphone", call, "micAnswered"); return; }
        begin(call);
    }
    @PermissionCallback private void micAnswered(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) begin(call); else call.reject("microphone_denied", "microphone_denied");
    }
    private void begin(PluginCall call) {
        if (!"idle".equals(SermonRecordService.state)) { call.resolve(info()); return; }
        SermonRecordService.title = call.getString("title", SermonRecordService.title);
        SermonRecordService.text = call.getString("text", SermonRecordService.text);
        Intent i = new Intent(getContext(), SermonRecordService.class);
        ContextCompat.startForegroundService(getContext(), i);
        // the service starts the recorder on its own thread; answer once it's running
        new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
            if ("recording".equals(SermonRecordService.state)) call.resolve(info()); else call.reject("start_failed");
        }, 600);
    }
    @PluginMethod public void pause(PluginCall call) { SermonRecordService.pause(); call.resolve(info()); }
    @PluginMethod public void resume(PluginCall call) { SermonRecordService.resume(); call.resolve(info()); }
    @PluginMethod public void status(PluginCall call) { call.resolve(info()); }
    @PluginMethod public void stop(PluginCall call) {
        double secs = SermonRecordService.seconds();
        File f = SermonRecordService.finish(getContext());
        if (f == null || !f.exists()) { call.reject("not_recording"); return; }
        JSObject o = new JSObject();
        o.put("path", Uri.fromFile(f).toString()); o.put("duration", secs); o.put("mimeType", "audio/mp4");
        call.resolve(o);
    }
    @PluginMethod public void discard(PluginCall call) {
        File f = SermonRecordService.file;
        if (!"idle".equals(SermonRecordService.state)) f = SermonRecordService.finish(getContext());
        String p = call.getString("path");
        if (p != null) { String path = Uri.parse(p).getPath(); if (path != null) f = new File(path); }
        if (f != null && f.getAbsolutePath().contains("/sermons/")) f.delete();
        call.resolve();
    }
}
