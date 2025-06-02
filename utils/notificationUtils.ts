import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// 通知の許可をリクエストする
export async function requestNotificationPermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}

// 毎日20時に通知をスケジュールする
export async function scheduleDailyNotification() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn("通知の許可がありません");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync(); // 既存の通知をクリア

  const trigger = {
    type: "calendar",
    hour: 20,
    minute: 0,
    repeats: true,
  } as Notifications.CalendarTriggerInput;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "今日の日記をお忘れなく！",
      body: "さっそく今日の出来事を記録しましょう ✍️",
    },
    trigger,
  });
}
