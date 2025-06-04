import React, { useState } from "react";
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

const Detail = () => {
  const router = useRouter();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState((i18n as any).locale);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f2f3f5" }}>
        <Hetter />

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
                onPress={() => {
                  if (item.label === (i18n as any).t("language")) {
                    setLanguageModalVisible(true);
                  } else if (item.label === (i18n as any).t("reminder")) {
                    scheduleDailyNotification();
                    Alert.alert(
                      (i18n as any).t("setNotificationTitle"),
                      (i18n as any).t("setNotificationMessage")
                    );
                  } else {
                    console.log(`${item.label} が押されました`);
                  }
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={item.iconName as any} size={24} color="#555" />
                  <Text style={{ fontSize: 16, marginLeft: 16, color: "#333", fontWeight: "500" }}>
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={22} color="#aaa" />
              </TouchableOpacity>
            );
          })}

          {languageModalVisible && (
            <View
              style={{
                position: "absolute",
                top: "30%",
                left: "10%",
                right: "10%",
                padding: 25,
                backgroundColor: "rgba(255,255,255,0.97)",
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 6,
                zIndex: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 25,
                  fontWeight: "600",
                  color: "#222",
                }}
              >
                {(i18n as any).t("selectLanguage")}
              </Text>

              {["ja", "en"].map((lang) => (
                <Pressable
                  key={lang}
                  onPress={() => changeLanguage(lang as "ja" | "en")}
                  style={({ pressed }) => [
                    {
                      paddingVertical: 14,
                      borderRadius: 10,
                      backgroundColor: pressed ? "#f0f0f0" : "transparent",
                      marginBottom: 12,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16 }}>
                    {lang === "ja"
                      ? "🇯🇵 " + (i18n as any).t("japanese")
                      : "🇺🇸 " + (i18n as any).t("english")}
                  </Text>
                </Pressable>
              ))}

              <TouchableOpacity
                onPress={() => setLanguageModalVisible(false)}
                style={{ marginTop: 30, alignSelf: "center" }}
              >
                <Text
                  style={{
                    color: "#d9534f",
                    fontWeight: "600",
                    fontSize: 16,
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                  }}
                >
                  {(i18n as any).t("cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Detail;
