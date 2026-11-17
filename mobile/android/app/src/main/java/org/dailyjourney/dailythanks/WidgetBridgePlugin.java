package org.dailyjourney.dailythanks;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** WidgetBridge: the web app hands today's verse / thanks / passage to the home-screen widgets. */
@CapacitorPlugin(name = "WidgetBridge")
public class WidgetBridgePlugin extends Plugin {
    static final String PREFS = "dt_widget";

    @PluginMethod
    public void update(PluginCall call) {
        Context ctx = getContext();
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("json", call.getString("json", "{}")).apply();
        refresh(ctx, TodayThanksWidget.class);
        refresh(ctx, MeditationWidget.class);
        refresh(ctx, VerseWidget.class);
        call.resolve();
    }

    static void refresh(Context ctx, Class<?> cls) {
        AppWidgetManager m = AppWidgetManager.getInstance(ctx);
        int[] ids = m.getAppWidgetIds(new ComponentName(ctx, cls));
        if (ids.length == 0) return;
        Intent i = new Intent(ctx, cls).setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE).putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        ctx.sendBroadcast(i);
    }
}
