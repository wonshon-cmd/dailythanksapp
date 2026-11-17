package org.dailyjourney.dailythanks;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(WidgetBridgePlugin.class); // home-screen widgets
        registerPlugin(PrivacyPlugin.class);      // no screenshots of other people's group posts
        registerPlugin(SecureStorePlugin.class);  // privacy-lock key in the Android Keystore
        registerPlugin(SermonRecorderPlugin.class); // sermon recording that keeps going with the screen off
        super.onCreate(savedInstanceState);
    }
}
