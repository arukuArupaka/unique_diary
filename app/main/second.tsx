import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useSelectedDate } from "@/data/DateContext";
import {
  SafeAreaView,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Header from "@/components/header";
import Footer from "@/components/footer";
import CustomCalendar from "@/components/Calendar";

const Second = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  const [diaryText, setDiaryText] = useState("");
  const [todayDiary, setTodayDiary] = useState("読み込み中...");

  const getTodayString = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!selectedDate) return;
    const loadDiaryForDate = async () => {
      try {
        const key = `diary-${selectedDate}`;
        const savedText = await AsyncStorage.getItem(key);
        setDiaryText(savedText || "まだこの日の日記はありません。");
      } catch (error) {
        setDiaryText("読み込みエラー");
        console.error("指定日の読み込み失敗:", error);
      }
    };

    loadDiaryForDate();
  }, [selectedDate]);

  // 今日書かれた日記を読み込む
  useFocusEffect(
    useCallback(() => {
      const loadTodayDiary = async () => {
        try {
          const todayStr = getTodayString();
          // ★キーの形式を 'diary-YYYY-MM-DD' に統一
          const key = `diary-${todayStr}`;
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
        <Header />
        <View
          style={{
            flex: 1,
            paddingHorizontal: "0%",
            paddingTop: "0%",
            backgroundColor: "",
          }}
        >
          <View>
            <CustomCalendar
              onDateSelected={setSelectedDate}
              selectedDate={selectedDate}
            />
          </View>
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
            <ScrollView>
              <Text style={{ marginTop: 10, fontSize: 18 }}>{diaryText}</Text>
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              const router = useRouter();
              // ★日付が選択されていなければ、今日の日付を送るように修正
              const dateToSend = selectedDate || getTodayString();
              router.push({
                pathname: "/main/InputPase",
                params: { entryDate: dateToSend }, // ★entryDateという名前で日付を手渡し
              });
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
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Second;
