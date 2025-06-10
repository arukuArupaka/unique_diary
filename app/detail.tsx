import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Hetter from "./hetter";
import Hutter from "./hutter";
import { useRouter } from "expo-router";
import { scheduleDailyNotification } from "../components/notificationUtils";
import "../notifications/notificationHandler";
import i18n from "../utils/i18n";
import * as SecureStore from "expo-secure-store";

const Detail = () => {
  const router = useRouter();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    (i18n as any).locale
  );
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false); //passcodeの有効無効を判定

  useEffect(() => {
    const loadPasscodeStatus = async () => {
      const enabled = await SecureStore.getItemAsync("passcode_enabled");
      setPasscodeEnabled(enabled === "true");
    };
    loadPasscodeStatus();
  }, []);

  const disablePasscode = async () => {
    await SecureStore.deleteItemAsync("passcode");
    await SecureStore.setItemAsync("passcode_enabled", "false");
    setPasscodeEnabled(false);
    Alert.alert("完了", "パスコード機能を無効にしました");
  };
  const changeLanguage = (lang: "ja" | "en") => {
    (i18n as any).locale = lang;
    setSelectedLanguage(lang);
    setLanguageModalVisible(false);
  };

  const settingItems = [
    {
      label: (i18n as any).t("theme"),
      iconLib: MaterialCommunityIcons,
      iconName: "theme-light-dark",
    },
    {
      label: (i18n as any).t("passcode"),
      iconLib: Feather,
      iconName: "lock",
    },
    {
      label: (i18n as any).t("reminder"),
      iconLib: Feather,
      iconName: "bell",
    },
    {
      label: (i18n as any).t("language"),
      iconLib: Feather,
      iconName: "settings",
    },
    {
      label: (i18n as any).t("otherC"),
      iconLib: Feather,
      iconName: "settings",
    },
    {
      label: (i18n as any).t("otherD"),
      iconLib: Feather,
      iconName: "settings",
    },
  ];

  const backgroundColor = theme === "light" ? "#f2f3f5" : "#121212";
  const cardColor = theme === "light" ? "#fff" : "#1e1e1e";
  const textColor = theme === "light" ? "#333" : "#f5f5f5";
  const iconColor = theme === "light" ? "#555" : "#ccc";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor }}>
        <Hetter />

        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          {settingItems.map((item, index) => {
            const Icon = item.iconLib;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: cardColor,
                  borderRadius: 16,
                  paddingVertical: 22,
                  paddingHorizontal: 18,
                  marginBottom: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  elevation: Platform.OS === "android" ? 2 : 0,
                }}
                onPress={() => {
                  if (item.label === (i18n as any).t("language")) {
                    setLanguageModalVisible(true);
                  } else if (item.label === (i18n as any).t("reminder")) {
                    scheduleDailyNotification();
                    Alert.alert(
                      (i18n as any).t("setNotificationTitle"),
                      (i18n as any).t("setNotificationMessage")
                    );
                  } else if (item.label === (i18n as any).t("theme")) {
                    setThemeModalVisible(true);
                  } else if (item.label === (i18n as any).t("passcode")) {
                    if (!passcodeEnabled) {
                      router.push("/set-passcode");
                    } else {
                      Alert.alert(
                        "警告",
                        "現在記憶しているパスコードを一度削除してよろしいですか？",
                        [
                          {
                            text: "キャンセル",
                            style: "cancel", //iosだとボタンが左側になるらしい
                          },
                          {
                            text: "無効にする",
                            style: "destructive",
                            onPress: () => disablePasscode(),
                          },
                        ],
                        { cancelable: true }
                      );
                    }
                  } else {
                    console.log(`${item.label} が押されました`);
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                    name={item.iconName as any}
                    size={24}
                    color={iconColor}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 16,
                      color: textColor,
                      fontWeight: "500",
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={22} color="#aaa" />
              </TouchableOpacity>
            );
          })}
        </View>

        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Detail;
