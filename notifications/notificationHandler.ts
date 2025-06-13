import * as Notifications from "expo-notifications";

// 通知の表示設定（すべて true にしておくと安心）
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ 追加
    shouldShowList: true,   // ✅ 追加
  }),
});
