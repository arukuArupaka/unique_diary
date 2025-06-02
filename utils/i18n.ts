// utils/i18n.ts

import { I18n } from "i18n-js";

// 各言語の翻訳
const ja = {
  theme: "テーマ",
  passcode: "パスコード",
  reminder: "リマインダー",
  language: "言語",
  otherC: "その他C",
  otherD: "その他D",
  selectLanguage: "言語を選択",
  japanese: "日本語",
  english: "英語",
  cancel: "キャンセル",
};

const en = {
  theme: "Theme",
  passcode: "Passcode",
  reminder: "Reminder",
  language: "Language",
  otherC: "Other C",
  otherD: "Other D",
  selectLanguage: "Select Language",
  japanese: "Japanese",
  english: "English",
  cancel: "Cancel",
};

// インスタンスを作成して設定
const i18n = new I18n({ ja, en });
i18n.defaultLocale = "ja";
i18n.locale = "ja";
i18n.enableFallback = true;

export default i18n;
