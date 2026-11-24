package com.paisakhata.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.telephony.SmsMessage;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SmsBackgroundReceiver extends BroadcastReceiver {
    private static final String TAG = "SmsReceiver";
    private static final String PREFS_NAME = "CapacitorStorage";
    private static final String PENDING_SMS_KEY = "pending_sms_transactions";

    // Regex for currency and bank terms
    private static final String AMOUNT_REGEX = "(?i)(?:rs\\.?|inr|₹)\\s?([\\d,]+(?:\\.\\d{1,2})?)";
    private static final String BANK_TERMS_REGEX = "(?i)(debited|credited|transferred|paid to|received|a/c|upi)";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (!"android.provider.Telephony.SMS_RECEIVED".equals(intent.getAction())) return;

        Bundle bundle = intent.getExtras();
        if (bundle == null) return;

        Object[] pdus = (Object[]) bundle.get("pdus");
        if (pdus == null) return;

        for (Object pdu : pdus) {
            SmsMessage sms = SmsMessage.createFromPdu((byte[]) pdu);
            String address = sms.getOriginatingAddress();
            String body = sms.getMessageBody();

            if (isValidBankMessage(address, body)) {
                saveTransaction(context, body);
            }
        }
    }

    private boolean isValidBankMessage(String address, String body) {
        if (address == null || body == null) return false;

        // Ignore standard 10-digit mobile numbers (often personal)
        // Bank headers are usually alphanumeric (e.g., AD-HDFCBK)
        if (address.matches("\\+?\\d{10,12}")) {
            return false;
        }

        Pattern amountPattern = Pattern.compile(AMOUNT_REGEX);
        Pattern termsPattern = Pattern.compile(BANK_TERMS_REGEX);

        Matcher amountMatcher = amountPattern.matcher(body);
        Matcher termsMatcher = termsPattern.matcher(body);

        return amountMatcher.find() && termsMatcher.find();
    }

    private void saveTransaction(Context context, String body) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String existing = prefs.getString(PENDING_SMS_KEY, "[]");

        String lowerBody = body.toLowerCase();
        String type = (lowerBody.contains("credited") || lowerBody.contains("received")) ? "credit" : "debit";

        try {
            JSONArray array = new JSONArray(existing);
            org.json.JSONObject obj = new org.json.JSONObject();
            obj.put("body", body);
            obj.put("type", type);
            array.put(obj);
            prefs.edit().putString(PENDING_SMS_KEY, array.toString()).apply();
            Log.d(TAG, "Saved bank SMS to pending list with type: " + type);
        } catch (JSONException e) {
            Log.e(TAG, "Error saving SMS", e);
        }
    }
}
