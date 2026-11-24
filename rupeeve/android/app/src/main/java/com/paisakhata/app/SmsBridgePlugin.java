package com.paisakhata.app;

import android.content.Context;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import android.Manifest;

import org.json.JSONArray;
import org.json.JSONException;

@CapacitorPlugin(
    name = "SmsBridge",
    permissions = {
        @Permission(
            alias = "sms",
            strings = {Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS}
        )
    }
)
public class SmsBridgePlugin extends Plugin {
    private static final String PREFS_NAME = "CapacitorStorage";
    private static final String PENDING_SMS_KEY = "pending_sms_transactions";

    @PluginMethod
    public void getPendingTransactions(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String pending = prefs.getString(PENDING_SMS_KEY, "[]");

        JSObject ret = new JSObject();
        try {
            ret.put("messages", new JSONArray(pending));
            call.resolve(ret);
        } catch (JSONException e) {
            call.reject("Failed to parse pending SMS");
        }
    }

    @PluginMethod
    public void clearPendingTransactions(PluginCall call) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().remove(PENDING_SMS_KEY).apply();
        call.resolve();
    }
}
