package org.dailyjourney.dailythanks;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

/** 오늘의 감사: your thanks today (or today's question), the streak, and a write button. */
public class TodayThanksWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        WidgetData x = new WidgetData(context);
        String mine = x.today ? x.s("thanks") : "";
        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("daily-bible://write"), context, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap = PendingIntent.getActivity(context, 2, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        for (int id : ids) {
            RemoteViews v = new RemoteViews(context.getPackageName(), R.layout.today_thanks_widget);
            v.setTextViewText(R.id.tw_label, x.label("thanks", context.getString(R.string.tw_label)));
            v.setTextViewText(R.id.tw_streak, x.today ? x.s("streakText") : "");
            v.setTextViewText(R.id.tw_text, !mine.isEmpty() ? mine : (x.s("question").isEmpty() ? context.getString(R.string.widget_question) : x.s("question")));
            v.setTextViewText(R.id.tw_btn, mine.isEmpty() ? "+ " + x.label("write", context.getString(R.string.tw_write)) : "✓ " + x.label("done", context.getString(R.string.tw_done)));
            v.setOnClickPendingIntent(R.id.tw_root, tap);
            manager.updateAppWidget(id, v);
        }
    }
}
