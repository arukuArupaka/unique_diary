import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useSelectedDate } from "@/data/DateContext";

import { CardStyleInterpolators } from "@react-navigation/stack";

import {
  SafeAreaView,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Hetter from "./hetter";
import Hutter from "./hutter";
import { Calendar } from "react-native-calendars";
import CustomCalendar from "../components/Calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Second = () => {
  const formatDateKey = (dateString: string) => {
    //YYYY-0M-0Dの０を消している
    const [year, month, day] = dateString.split("-");
    return `diary-${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`; //paeseIntで0を消している
  };

  const { selectedDate, setSelectedDate } = useSelectedDate(); //日付を選択したときにselectedDateにyyyy-mm-ddの形で入る。
  const [diaryText, setDiaryText] = useState("");
  const [todayDiary, setTodayDiary] = useState("読み込み中..."); //とりあえず書いてる
  const selectday = () => {
    return selectedDate;
  };

  // 選択した日付の日記を読み込む
  useEffect(() => {
    if (!selectedDate) return; //その日が押されたとき
    const loadDiaryForDate = async () => {
      try {
        const key = formatDateKey(selectedDate); //keyの形を変更
        const savedText = await AsyncStorage.getItem(key);
        setDiaryText(savedText || "まだこの日の日記はありません。");
      } catch (error) {
        setDiaryText("読み込みエラー");
        console.error("指定日の読み込み失敗:", error);
      }
    };

    loadDiaryForDate();
  }, [selectedDate]);

  useFocusEffect(
    useCallback(() => {
      const loadTodayDiary = async () => {
        try {
          const today = new Date();
          const key = `diary-${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;
          const text = await AsyncStorage.getItem(key);
          setTodayDiary(text || "まだ日記は書かれていません。");
        } catch (error) {
          setTodayDiary("読み込みエラー");
          console.error("日記読み込み失敗:", error);
        }
      };

      loadTodayDiary();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Hetter />
        {/* メイン部分　*/}
        <View
          style={{
            flex: 1,
            paddingHorizontal: "0%",
            paddingTop: "0%",
            backgroundColor: "",
          }}
        >
          {/* ↓ここに作っていく */}
          {/* カレンダー */}
          <View>
            <CustomCalendar
              onDateSelected={setSelectedDate} //ここで日にちが押されたときにselectedDateにyyyy-mm-ddの形で入る。
              selectedDate={selectedDate}
            />
          </View>
          {/* 日記表示 */}
          <View
            style={{
              width: "100%",
              height: "38%",
              backgroundColor: "",
              paddingHorizontal: "10%",
              paddingTop: "10%",
            }}
          >
            {selectedDate ? (
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {selectedDate} の日記:
              </Text>
            ) : (
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                日付を選んでください
              </Text>
            )}
            <Text style={{ marginTop: 10, fontSize: 18 }}>{diaryText}</Text>
          </View>
          {/* 日記入力画面への移動 */}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              useRouter().push("/InputPase");
            }}
            style={{
              marginLeft: "80%",
              width: 60,
              height: 60,
              borderRadius: 40,
              borderColor: "black",
              borderWidth: 1,
              alignItems: "center",
              backgroundColor: "#ffffff",
              shadowColor: "black",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 3,
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name="pencil-alt" size={40} color="black" />
          </TouchableOpacity>
        </View>
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Second;
//export { selectday };
