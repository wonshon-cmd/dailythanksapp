package org.dailyjourney.dailythanks;

import android.view.WindowManager;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Privacy: while other people's group posts are on screen, the window is marked secure
 *  (screenshots and screen recordings come out black, and the app preview in "recents" is hidden). */
@CapacitorPlugin(name = "Privacy")
public class PrivacyPlugin extends Plugin {
    @PluginMethod
    public void protect(PluginCall call) {
        final boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        getActivity().runOnUiThread(() -> {
            if (on) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
        });
        call.resolve();
    }
}
