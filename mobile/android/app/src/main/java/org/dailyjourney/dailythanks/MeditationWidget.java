package org.dailyjourney.dailythanks;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

/** 오늘의 묵상: today's passage (생명의 삶 when available) and a reflect button. */
public class MeditationWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        WidgetData x = new WidgetData(context);
        String src = x.s("passageSource");
        boolean done = x.today && x.d.optBoolean("meditated");
        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("daily-bible://meditation"), context, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap = PendingIntent.getActivity(context, 3, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        for (int id : ids) {
            RemoteViews v = new RemoteViews(context.getPackageName(), R.layout.meditation_widget);
            v.setTextViewText(R.id.mw_label, x.label("med", context.getString(R.string.mw_label)) + (src.isEmpty() ? "" : " · " + src));
            v.setTextViewText(R.id.mw_ref, x.today ? x.s("passage") : context.getString(R.string.mw_passage));
            v.setTextViewText(R.id.mw_text, x.today ? x.s("passageText") : "");
            v.setTextViewText(R.id.mw_btn, done ? "✓ " + x.label("medDone", context.getString(R.string.mw_done)) : "✎ " + x.label("medWrite", context.getString(R.string.mw_write)));
            v.setOnClickPendingIntent(R.id.mw_root, tap);
            manager.updateAppWidget(id, v);
        }
    }
}
