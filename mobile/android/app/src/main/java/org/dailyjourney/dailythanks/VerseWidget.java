package org.dailyjourney.dailythanks;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.net.Uri;
import android.widget.RemoteViews;
import java.util.Calendar;

/** Home-screen widget "오늘의 말씀": a verse about thanks, new each day (same list as the app). Tap → writing sheet. */
public class VerseWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        Resources r = context.getResources();
        String[] refs = r.getStringArray(R.array.verse_refs), texts = r.getStringArray(R.array.verse_texts);
        int i = (Calendar.getInstance().get(Calendar.DAY_OF_YEAR) - 1) % refs.length;
        Intent open = new Intent(Intent.ACTION_VIEW, Uri.parse("daily-thanks://write"), context, MainActivity.class);
        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap = PendingIntent.getActivity(context, 1, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        for (int id : ids) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.verse_widget);
            views.setTextViewText(R.id.verse_ref, refs[i]);
            views.setTextViewText(R.id.verse_text, texts[i]);
            views.setOnClickPendingIntent(R.id.verse_root, tap);
            manager.updateAppWidget(id, views);
        }
    }
}
