package com.modulemupi2023example;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class PinCodeModule extends ReactContextBaseJavaModule {

  private static final String PIN_KEY = "1234";

  public PinCodeModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "PinCodeModule";
  }

  @ReactMethod
  public void savePinCode(String pinCode) {
    SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
    SharedPreferences.Editor editor = prefs.edit();
    editor.putString(PIN_KEY, pinCode);
    editor.apply();
  }

  @ReactMethod
  public void checkPinCode(String pinCode, Promise promise) {
    SharedPreferences prefs = PreferenceManager.getDefaultSharedPreferences(getReactApplicationContext());
    String savedPinCode = prefs.getString(PIN_KEY, "");
    promise.resolve(savedPinCode.equals(pinCode));
  }
}
