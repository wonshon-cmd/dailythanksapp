package org.dailyjourney.dailythanks;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetBridgePlugin.class); // home-screen widgets
        registerPlugin(PrivacyPlugin.class);      // no screenshots of other people's group posts
        super.onCreate(savedInstanceState);
    }
}
