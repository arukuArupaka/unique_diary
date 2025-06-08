// utils/i18n.ts

import { I18n } from 'i18n-js';

// 翻訳データの定義
const translations = {
  ja: {
    theme: "テーマ",
    passcode: "パスコード",
    reminder: "リマインダー",
    language: "言語",
    otherC: "その他C",
    otherD: "その他D",
    selectLanguage: "言語を選択してください",
    selectTheme: "テーマを選択してください",
    japanese: "日本語",
    english: "英語",
    cancel: "キャンセル",
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
    otherC: "Other C",
    otherD: "Other D",
    selectLanguage: "Select a language",
    selectTheme: "Select a theme",
    japanese: "Japanese",
    english: "English",
    cancel: "Cancel",
    setNotificationTitle: "Notification Set",
    setNotificationMessage: "You will be reminded daily at 8 PM!",
    light: "Light",
    dark: "Dark",
  },
};

// I18n インスタンスの作成
const i18n = new I18n(translations);

// デフォルト設定
i18n.locale = 'ja'; // 初期表示は日本語
i18n.enableFallback = true; // 対応していない言語のときにフォールバックを有効にする

export default i18n;
