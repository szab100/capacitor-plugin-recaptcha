package com.szab100.capacitor.recaptcha;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.recaptcha.Recaptcha;
import com.google.android.recaptcha.RecaptchaAction;
import com.google.android.recaptcha.RecaptchaTasksClient;

@CapacitorPlugin(name = "RecaptchaEnterprise")
public class RecaptchaEnterprisePlugin extends Plugin {

    private String siteKey;
    private RecaptchaTasksClient recaptchaTasksClient;

    @PluginMethod
    public void load(PluginCall call) {
        String key = call.getString("siteKey");
        if (key == null || key.isEmpty()) {
            call.reject("siteKey is required");
            return;
        }
        this.siteKey = key;
        Recaptcha.fetchTaskClient(getActivity().getApplication(), this.siteKey)
            .addOnSuccessListener(client -> recaptchaTasksClient = client)
            .addOnFailureListener(e -> call.reject("Failed to init reCAPTCHA: " + e.getMessage()));
    }

    @PluginMethod
    public void execute(PluginCall call) {
        String action = call.getString("action", "");
        if (recaptchaTasksClient == null) {
            call.reject("reCAPTCHA not loaded. Call load(siteKey) during app startup.");
            return;
        }
        if (action == null || action.isEmpty()) {
            call.reject("action is required");
            return;
        }
        recaptchaTasksClient
            .executeTask(RecaptchaAction.custom(action))
            .addOnSuccessListener(token -> {
                JSObject ret = new JSObject();
                ret.put("token", token);
                ret.put("siteKey", siteKey);
                call.resolve(ret);
            })
            .addOnFailureListener(e -> call.reject("reCAPTCHA execution failed: " + e.getMessage()));
    }
}
