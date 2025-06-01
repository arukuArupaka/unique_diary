import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import Hetter from "./hetter";
import Hutter from "./hutter";

const detail = () => {
  const router = useRouter();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("日本語"); // 初期値：日本語

  // 言語ごとのラベルリストを取得
  const getSettingItems = (lang: string) => {
    if (lang === "English") {
      return [
        {
          label: "Theme",
          iconLib: MaterialCommunityIcons,
          iconName: "theme-light-dark",
        },
        { label: "Set Passcode", iconLib: Feather, iconName: "lock" },
        { label: "Option A", iconLib: Feather, iconName: "settings" },
        { label: "Language", iconLib: Feather, iconName: "settings" },
        { label: "Option C", iconLib: Feather, iconName: "settings" },
        { label: "Option D", iconLib: Feather, iconName: "settings" },
      ];
    } else {
      return [
        {
          label: "テーマ",
          iconLib: MaterialCommunityIcons,
          iconName: "theme-light-dark",
        },
        { label: "パスコードの登録", iconLib: Feather, iconName: "lock" },
        { label: "その他A", iconLib: Feather, iconName: "settings" },
        { label: "言語選択", iconLib: Feather, iconName: "settings" },
        { label: "その他C", iconLib: Feather, iconName: "settings" },
        { label: "その他D", iconLib: Feather, iconName: "settings" },
      ];
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        {/* ヘッダー */}
        <Hetter />

        {/* メイン */}
        <View style={{ flex: 1, paddingHorizontal: "10%", paddingTop: "10%" }}>
          {getSettingItems(selectedLanguage).map((item, index) => {
            const Icon = item.iconLib;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
                onPress={() => {
                  if (
                    item.label === "言語選択" ||
                    item.label === "Language"
                  ) {
                    setLanguageModalVisible(true);
                  } else {
                    console.log(`${item.label} が押されました`);
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={item.iconName as any} size={24} color="#555" />
                  <Text style={{ fontSize: 16, marginLeft: 16 }}>
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            );
          })}

          {/* 言語モーダル */}
          {languageModalVisible && (
            <View
              style={{
                position: "absolute",
                top: "30%",
                left: "10%",
                right: "10%",
                padding: 20,
                backgroundColor: "white",
                borderRadius: 10,
                elevation: 5,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                zIndex: 100,
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 20 }}>
                {selectedLanguage === "English"
                  ? "Select a language"
                  : "言語を選択してください"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setSelectedLanguage("日本語");
                  setLanguageModalVisible(false);
                }}
                style={{ paddingVertical: 10 }}
              >
                <Text>🇯🇵 日本語</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedLanguage("English");
                  setLanguageModalVisible(false);
                }}
                style={{ paddingVertical: 10 }}
              >
                <Text>🇺🇸 English</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLanguageModalVisible(false)}
                style={{ marginTop: 20 }}
              >
                <Text style={{ color: "gray" }}>
                  {selectedLanguage === "English" ? "Cancel" : "キャンセル"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* フッター */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default detail;
