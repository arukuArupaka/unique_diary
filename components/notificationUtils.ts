import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 通知許可をリクエストする関数
export async function requestNotificationPermission(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === "granted";
  }
  return true;
}

type DiaryTime = { hour: number; minute: number };

// AsyncStorageから過去の記録を取得し平均時刻を計算する関数
export const getAverageDiaryTime = async (): Promise<DiaryTime> => {
  const historyRaw = await AsyncStorage.getItem("diary-time-history");
  const history: DiaryTime[] = historyRaw ? JSON.parse(historyRaw) : [];

  if (history.length === 0) return { hour: 20, minute: 0 }; // デフォルト20:00

  let totalMinutes = 0;
  history.forEach(({ hour, minute }) => {
    totalMinutes += hour * 60 + minute;
  });

  const avgMinutes = Math.floor(totalMinutes / history.length);
  return {
    hour: Math.floor(avgMinutes / 60),
    minute: avgMinutes % 60,
  };
};

// 通知を毎日指定時間にスケジュールする関数
export async function scheduleDailyNotification() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn("通知の許可がありません");
    return;
  }

  const { hour, minute } = await getAverageDiaryTime();

  await Notifications.cancelAllScheduledNotificationsAsync(); // 既存の通知をキャンセル(Expoの通知全部！！？？)

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "いつもの時間です🕒",
      body: "そろそろ日記の時間かも？今日も振り返ろう ✍️",
    },
    trigger: {
      type: "calendar", //カレンダー型で20としたら、２０時間後ではなく、２０時に
      hour,
      minute,
      repeats: true,
    } as any, // エラー回避？
  });
}

// 新しい日記の記録時間を履歴に追加して保存する例
export const addDiaryTimeRecord = async (newTime: DiaryTime) => {
  const historyRaw = await AsyncStorage.getItem("diary-time-history");
  const history: DiaryTime[] = historyRaw ? JSON.parse(historyRaw) : [];
  history.push(newTime);
  await AsyncStorage.setItem("diary-time-history", JSON.stringify(history));
};
