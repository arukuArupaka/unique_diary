import { TouchableWithoutFeedback, View, Keyboard, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useSelectedDate } from "@/data/DateContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Input from "@/components/Input"; // Inputコンポーネントをインポート
import ContionuousIcon from "@/components/ContionuousIcon";

const InputPase = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate();
  // ★この画面では「前日の日記」を表示するためのState
  const [previousDiaryText, setPreviousDiaryText] = useState("");

  // 今日の日付を "YYYY-MM-DD" 形式で取得する関数
  const getTodayString = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().split("T")[0];
  };

  // ★バグのあった日付計算関数を、安全なものに置き換え
  // 指定された日付の「前日」を "YYYY-MM-DD" 形式で返す
  const getYesterdayString = (dateString: string): string => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-").map(Number);
    // JSのDateオブジェクトは月の計算（例: 3月1日の前日は2月28日）を自動で正しく行ってくれる
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // selectedDateがセットされていなければ、今日の日付をセットする
  useEffect(() => {
    if (!selectedDate) {
      const today = getTodayString();
      setSelectedDate(today);
    }
  }, [selectedDate, setSelectedDate]);

  // selectedDateが変わったら、その「前日」の日記をAsyncStorageから読み込む
  useEffect(() => {
    if (!selectedDate) return;

    const loadPreviousDiary = async () => {
      try {
        const yesterdayStr = getYesterdayString(selectedDate);
        // ★キーの形式を 'diary-YYYY-MM-DD' に完全に統一
        const key = `diary-${yesterdayStr}`;
        const savedText = await AsyncStorage.getItem(key);
        setPreviousDiaryText(savedText || "前の日の日記はありません。");
      } catch (error) {
        setPreviousDiaryText("読み込みエラー");
        console.error("前日の日記の読み込みに失敗:", error);
      }
    };

    loadPreviousDiary();
  }, [selectedDate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f8ff",
        }}
      >
        <Header />
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          {/* 日記入力コンポーネント */}
          <Input />

          {/* 条件に応じて、連続日数アイコンか、前日の日記プレビューを表示 */}
          {selectedDate === getTodayString() ? (
            <ContionuousIcon />
          ) : (
            <View
              style={{
                width: "100%",
                height: "38%",
                paddingHorizontal: "3%",
                paddingTop: "8%",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "90%",
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {getYesterdayString(selectedDate)} の日記
                </Text>
                <ScrollView style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18, lineHeight: 26 }}>
                    {previousDiaryText}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}
        </View>
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InputPase;
