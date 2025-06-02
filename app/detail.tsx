import React, { useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Hetter from "./hetter";
import Hutter from "./hutter";
import { useRouter } from "expo-router";
import { scheduleDailyNotification } from "../utils/notificationUtils";
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
    { label: (i18n as any).t("passcode"), iconLib: Feather, iconName: "lock" },
    { label: (i18n as any).t("reminder"), iconLib: Feather, iconName: "bell" },
    { label: (i18n as any).t("language"), iconLib: Feather, iconName: "settings" },
    { label: (i18n as any).t("otherC"), iconLib: Feather, iconName: "settings" },
    { label: (i18n as any).t("otherD"), iconLib: Feather, iconName: "settings" },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Hetter />

        <View style={{ flex: 1, paddingHorizontal: "10%", paddingTop: "10%" }}>
          <>
            {settingItems.map((item, index) => {
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
                    <Text style={{ fontSize: 16, marginLeft: 16 }}>{item.label}</Text>
                  </View>
                  <Feather name="chevron-right" size={24} color="#999" />
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
                  {(i18n as any).t("selectLanguage")}
                </Text>

                <TouchableOpacity
                  onPress={() => changeLanguage("ja")}
                  style={{ paddingVertical: 10 }}
                >
                  <Text>🇯🇵 {(i18n as any).t("japanese")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => changeLanguage("en")}
                  style={{ paddingVertical: 10 }}
                >
                  <Text>🇺🇸 {(i18n as any).t("english")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setLanguageModalVisible(false)}
                  style={{ marginTop: 20 }}
                >
                  <Text style={{ color: "gray" }}>{(i18n as any).t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        </View>

        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Detail;
