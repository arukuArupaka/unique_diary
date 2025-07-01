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
import Header from "./header";
import Footer from "./footer";
import { useRouter, useFocusEffect } from "expo-router";
import { scheduleDailyNotification } from "../components/notificationUtils";
import "../notifications/notificationHandler";
import * as SecureStore from "expo-secure-store";

const Detail = () => {
  const router = useRouter();

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
      Alert.alert("完了", "パスコード機能を無効にしました");
    } catch (e) {
      console.warn("パスコード無効化失敗", e);
    }
  };

  // 設定項目リスト
  const settingItems = [
    {
      label: "パスコード",
      iconLib: Feather,
      iconName: passcodeEnabled ? "lock" : "unlock", //ちょっとこだわり
      onPress: () => {
        if (!passcodeEnabled) {
          router.push("/set-passcode");
        } else {
          Alert.alert(
            "警告",
            "現在記憶しているパスコードを一度削除してよろしいですか？",
            [
              { text: "キャンセル", style: "cancel" },
              {
                text: "無効にする",
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
      label: "リマインダー",
      iconLib: Feather,
      iconName: "bell",
      onPress: () => {
        scheduleDailyNotification();
        Alert.alert("通知を設定しました", "毎日20時にリマインドされます!");
      },
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Header />

        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          {settingItems.map((item, index) => {
            const Icon = item.iconLib;
            return (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: "#fff",
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
                  <Icon name={item.iconName as any} size={24} color="#555" />
                  <Text
                    style={{
                      fontSize: 16,
                      marginLeft: 16,
                      color: "#333",
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
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Detail;
