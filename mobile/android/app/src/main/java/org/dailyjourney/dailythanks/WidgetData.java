package org.dailyjourney.dailythanks;

import android.content.Context;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import org.json.JSONObject;

/** Today's data written by the app (WidgetBridge). Empty / old data → defaults. */
final class WidgetData {
    final JSONObject d;
    final boolean today;
    WidgetData(Context ctx) {
        JSONObject j;
        try { j = new JSONObject(ctx.getSharedPreferences(WidgetBridgePlugin.PREFS, Context.MODE_PRIVATE).getString("json", "{}")); }
        catch (Exception e) { j = new JSONObject(); }
        d = j;
        today = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()).equals(d.optString("date"));
    }
    String s(String k) { return d.optString(k, ""); }
    String label(String k, String fallback) { JSONObject l = d.optJSONObject("labels"); return l != null && l.has(k) ? l.optString(k) : fallback; }
}
