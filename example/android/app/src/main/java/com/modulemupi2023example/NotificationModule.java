package com.modulemupi2023example;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;
import android.provider.Settings;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;
  private final String CHANNEL_ID = "YourChannelId"; // Замените на свой идентификатор канала

  public NotificationModule(@Nullable ReactApplicationContext context) {
    super(context);
    this.reactContext = context;
    createNotificationChannel();
  }

  @Override
  public String getName() {
    return "NotificationModule";
  }

  @ReactMethod
  public void sendNotification(String title, String message) {
    try {
      NotificationCompat.Builder builder = new NotificationCompat.Builder(reactContext, CHANNEL_ID)
          .setSmallIcon(
              android.R.drawable.ic_dialog_info)
          .setContentTitle(title)
          .setContentText(message)
          .setPriority(NotificationCompat.PRIORITY_MAX) // Устанавливаем максимальный приоритет
          .setDefaults(NotificationCompat.DEFAULT_ALL) // Устанавливаем все доступные по умолчанию опции
          .setFullScreenIntent(null, true) // Полноэкранное уведомление
          .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE);

      // Ensure each notification has a unique ID by using System.currentTimeMillis()
      long notificationId = System.currentTimeMillis();

      NotificationManager notificationManager = (NotificationManager) reactContext
          .getSystemService(Context.NOTIFICATION_SERVICE);

      if (notificationManager != null) {
        // Создание канала уведомлений (требуется для Android 8.0 и выше)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Channel Name",
              NotificationManager.IMPORTANCE_HIGH);
          notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify((int) notificationId, builder.build());
      } else {
        Log.e("NotificationModule", "NotificationManager is null");
      }

    } catch (Exception e) {
      Log.e("NotificationModule", "Failed to send notification: " + e.getMessage());
    }
  }

  private void createNotificationChannel() {
    // Create the NotificationChannel, but only on API 26+ because
    // the NotificationChannel class is not in the Support Library.
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      CharSequence name = "12315444444";
      String description = "12312312";
      int importance = NotificationManager.IMPORTANCE_DEFAULT;
      NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
      channel.setDescription(description);
      // Register the channel with the system; you can't change the importance
      // or other notification behaviors after this.
      NotificationManager notificationManager = (NotificationManager) reactContext
          .getSystemService(Context.NOTIFICATION_SERVICE);
      notificationManager.createNotificationChannel(channel);
    }
  }
}
