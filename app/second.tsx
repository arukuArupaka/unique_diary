import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { useRouter, useNavigation } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
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

  const [selectedDate, setSelectedDate] = useState("");
  const [diaryText, setDiaryText] = useState("");
  const [todayDiary, setTodayDiary] = useState("読み込み中..."); //とりあえず書いてる

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

        {/* カレンダー */}
        <View>
          <CustomCalendar onDateSelected={setSelectedDate} />
        </View>

        {/* 日記表示 */}
        <View style={{ flex: 1, paddingHorizontal: "10%", paddingTop: "10%" }}>
          {selectedDate ? (
            <Text style={{ fontSize: 16 }}>{selectedDate} の日記:</Text>
          ) : (
            <Text style={{ fontSize: 16 }}>日付を選んでください</Text>
          )}
          <Text style={{ marginTop: 10, fontSize: 18 }}>{diaryText}</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              今日の日記：
            </Text>
            <Text style={{ fontSize: 16, marginTop: 10 }}>{todayDiary}</Text>
          </View>
        </View>

        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Second;
