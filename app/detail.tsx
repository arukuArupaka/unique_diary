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
        {/* メイン部分　*/}
        <View
          style={{
            flex: 1,
            paddingHorizontal: "10%",
            paddingTop: "10%",
            backgroundColor: "",
          }} //↓ここに作っていく
        ></View>
        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default detail;
