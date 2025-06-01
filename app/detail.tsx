import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Hetter from "./hetter";
import Hutter from "./hutter";

const detail = () => {
  const router = useRouter();
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayString = `${month}月${day}日`; // 今日の日付

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f8ff",
        }}
      >
        {/* ヘッダー部分 */}
        <Hetter />

        {/* メイン部分 */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: "10%",
            paddingTop: "10%",
          }}
        >
          {[
            {
              label: "テーマ",
              iconLib: MaterialCommunityIcons,
              iconName: "theme-light-dark",
            },
            { label: "パスコードの登録", iconLib: Feather, iconName: "lock" },
            { label: "その他A", iconLib: Feather, iconName: "settings" },
            { label: "その他B", iconLib: Feather, iconName: "settings" },
            { label: "その他C", iconLib: Feather, iconName: "settings" },
            { label: "その他D", iconLib: Feather, iconName: "settings" },
          ].map((item, index) => {
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
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon name={item.iconName} size={24} color="#555" />
                  <Text style={{ fontSize: 16, marginLeft: 16 }}>
                    {item.label}
                  </Text>
                </View>
                <Feather name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default detail;
