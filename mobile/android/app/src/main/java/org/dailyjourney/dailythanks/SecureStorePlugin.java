package org.dailyjourney.dailythanks;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/** SecureStore: small secrets (the privacy-lock key) encrypted with a key held by the Android Keystore
 *  (hardware-backed where available; it never leaves the device and is never exported). */
@CapacitorPlugin(name = "SecureStore")
public class SecureStorePlugin extends Plugin {
    private static final String ALIAS = "dailythanks_secure", PREFS = "dt_secure";

    private SecretKey key() throws Exception {
        KeyStore ks = KeyStore.getInstance("AndroidKeyStore"); ks.load(null);
        if (ks.containsAlias(ALIAS)) return ((KeyStore.SecretKeyEntry) ks.getEntry(ALIAS, null)).getSecretKey();
        KeyGenerator g = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore");
        g.init(new KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setKeySize(256).build());
        return g.generateKey();
    }
    private SharedPreferences prefs() { return getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE); }

    @PluginMethod
    public void get(PluginCall call) {
        String k = call.getString("key"); if (k == null) { call.reject("key required"); return; }
        JSObject out = new JSObject();
        try {
            String stored = prefs().getString(k, null);
            if (stored == null) { out.put("value", null); call.resolve(out); return; }
            byte[] all = Base64.decode(stored, Base64.NO_WRAP);
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding");
            c.init(Cipher.DECRYPT_MODE, key(), new GCMParameterSpec(128, all, 0, 12));
            out.put("value", new String(c.doFinal(all, 12, all.length - 12), StandardCharsets.UTF_8));
            call.resolve(out);
        } catch (Exception e) { call.reject("secure read failed", e); }
    }

    @PluginMethod
    public void set(PluginCall call) {
        String k = call.getString("key"), v = call.getString("value");
        if (k == null || v == null) { call.reject("key and value required"); return; }
        try {
            Cipher c = Cipher.getInstance("AES/GCM/NoPadding"); c.init(Cipher.ENCRYPT_MODE, key());
            byte[] iv = c.getIV(), ct = c.doFinal(v.getBytes(StandardCharsets.UTF_8)), all = new byte[iv.length + ct.length];
            System.arraycopy(iv, 0, all, 0, iv.length); System.arraycopy(ct, 0, all, iv.length, ct.length);
            prefs().edit().putString(k, Base64.encodeToString(all, Base64.NO_WRAP)).apply();
            call.resolve();
        } catch (Exception e) { call.reject("secure write failed", e); }
    }

    @PluginMethod
    public void remove(PluginCall call) {
        String k = call.getString("key"); if (k == null) { call.reject("key required"); return; }
        prefs().edit().remove(k).apply(); call.resolve();
    }
}
