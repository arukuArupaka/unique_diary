// utils/i18n.ts

import { I18n } from "i18n-js";

// 翻訳データの定義
const translations = {
  ja: {
    theme: "テーマ",
    passcode: "パスコード",
    reminder: "リマインダー",
    language: "言語",
    dailyHistory: "日別履歴を見る",
    monthlyStats: "月別統計を見る",
    otherC: "その他C",
    otherD: "その他D",
    selectLanguage: "言語を選択してください",
    selectTheme: "テーマを選択してください",
    japanese: "日本語",
    english: "英語",
    cancel: "キャンセル",
    disable: "無効にする",
    warning: "警告",
    done: "完了",
    passcodeDisabledMessage: "パスコード機能を無効にしました",
    passcodeDisableConfirmMessage:
      "現在記憶しているパスコードを一度削除してよろしいですか？",
    setNotificationTitle: "通知を設定しました",
    setNotificationMessage: "毎日20時にリマインドされます!",
    light: "ライト",
    dark: "ダーク",
  },
  en: {
    theme: "Theme",
    passcode: "Passcode",
    reminder: "Reminder",
    language: "Language",
    dailyHistory: "View Daily History",
    monthlyStats: "View Monthly Stats",
    otherC: "Other C",
    otherD: "Other D",
    selectLanguage: "Select a language",
    selectTheme: "Select a theme",
    japanese: "Japanese",
    english: "English",
    cancel: "Cancel",
    disable: "Disable",
    warning: "Warning",
    done: "Done",
    passcodeDisabledMessage: "Passcode feature disabled",
    passcodeDisableConfirmMessage:
      "Are you sure you want to delete the saved passcode?",
    setNotificationTitle: "Notification Set",
    setNotificationMessage: "You will be reminded daily at 8 PM!",
    light: "Light",
    dark: "Dark",
  },
};

// I18n インスタンスの作成
const i18n = new I18n(translations);

// デフォルト設定
i18n.locale = "ja"; // 初期表示は日本語
i18n.enableFallback = true; // 対応していない言語のときにフォールバックを有効にする

export default i18n;
