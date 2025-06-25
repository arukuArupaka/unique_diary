import React, { useEffect, useState, useCallback } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Hetter from "./hetter";
import Hutter from "./hutter";
import { useRouter, useFocusEffect } from "expo-router";
import { scheduleDailyNotification } from "../components/notificationUtils";
import "../notifications/notificationHandler";
import i18n from "../utils/i18n";
import * as SecureStore from "expo-secure-store";

const Detail = () => {
  const router = useRouter();

  // 言語選択モーダルの表示状態
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  // 現在選択中の言語
  const [selectedLanguage, setSelectedLanguage] = useState(
    (i18n as any).locale
  );
  // テーマ（light / dark）
  const [theme, setTheme] = useState<"light" | "dark">("light");
  // テーマ選択モーダルの表示状態
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  // パスコード機能の有効無効
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);

  // SecureStoreからパスコード有効状態を取得してstate更新
  const refreshPasscodeStatus = useCallback(async () => {
    try {
      const enabled = await SecureStore.getItemAsync("passcode_enabled");
      setPasscodeEnabled(enabled === "true");
    } catch (e) {
      console.warn("パスコード状態取得失敗", e);
    }
  }, []);

  // フォーカスされた時にパスコード状態を再読み込み
  useFocusEffect(
    useCallback(() => {
      refreshPasscodeStatus();
    }, [refreshPasscodeStatus])
  );

  // パスコード機能を無効にする（SecureStoreから削除）
  const disablePasscode = async () => {
    try {
      await SecureStore.deleteItemAsync("passcode");
      await SecureStore.deleteItemAsync("passcode_enabled");
      setPasscodeEnabled(false);
      Alert.alert(i18n.t("done"), i18n.t("passcodeDisabledMessage"));
    } catch (e) {
      console.warn("パスコード無効化失敗", e);
    }
  };

  // 言語を切り替える処理
  const changeLanguage = (lang: "ja" | "en") => {
    (i18n as any).locale = lang;
    setSelectedLanguage(lang);
    setLanguageModalVisible(false);
  };

  // 設定項目リスト
  const settingItems = [
    // {
    //   label: i18n.t("theme"),
    //   iconLib: MaterialCommunityIcons,
    //   iconName: "theme-light-dark",
    //   onPress: () => setThemeModalVisible(true),
    // },
    {
      // <Feather name="unlock" size={24} color="black" /> これ使う
      label: i18n.t("passcode"),
      iconLib: Feather,
      iconName: "lock",
      onPress: () => {
        if (!passcodeEnabled) {
          router.push("/set-passcode");
        } else {
          Alert.alert(
            i18n.t("warning"),
            i18n.t("passcodeDisableConfirmMessage"),
            [
              { text: i18n.t("cancel"), style: "cancel" },
              {
                text: i18n.t("disable"),
                style: "destructive",
                onPress: disablePasscode,
              },
            ],
            { cancelable: true }
          );
        }
      },
    },
    {
      label: i18n.t("reminder"),
      iconLib: Feather,
      iconName: "bell",
      onPress: () => {
        scheduleDailyNotification();
        Alert.alert(
          i18n.t("setNotificationTitle"),
          i18n.t("setNotificationMessage")
        );
      },
    },
    // {
    //   label: i18n.t("language"),
    //   iconLib: Feather,
    //   iconName: "settings",
    //   onPress: () => setLanguageModalVisible(true),
    // },
    // {
    //   label: i18n.t("dailyHistory"),
    //   iconLib: Feather,
    //   iconName: "calendar",
    //   onPress: () => router.push("/history/daily"),
    // },
    // {
    //   label: i18n.t("monthlyStats"),
    //   iconLib: Feather,
    //   iconName: "chart-bar",
    //   onPress: () => router.push("/history/monthly"),
    // },
  ];

  // テーマによる色の切り替え
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
                onPress={item.onPress}
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
