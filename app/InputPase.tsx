import Input from "@/components/Input";
import { TouchableWithoutFeedback, View, Keyboard, Text } from "react-native";
import Hetter from "./header";
import Hutter from "./footer";
import {} from "@/app/second"; // 選択した日付を取得するためのコンテキスト
import { useSelectedDate } from "@/data/DateContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const inputPase = () => {
  const { selectedDate } = useSelectedDate();
  const [diaryText, setDiaryText] = useState("");

  const yestselectedDatte = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    date.setDate(date.getDate() - 1);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const yestdayDateKey = (dateString: string) => {
    const [year, month, day] = dateString.split("-");
    return `diary-${parseInt(year)}-${parseInt(month)}-${parseInt(day) - 1}`;
  };

  useEffect(() => {
    const loadDiaryForDate = async () => {
      try {
        const key = yestdayDateKey(selectedDate); //keyの形を変更
        const savedText = await AsyncStorage.getItem(key);
        setDiaryText(savedText || "まだこの日の日記はありません。");
      } catch (error) {
        setDiaryText("読み込みエラー");
        console.error("指定日の読み込み失敗:", error);
      }
    };

    loadDiaryForDate();
  }, [selectedDate]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f8ff", //白よりちょっと暗い色で
        }}
      >
        {/* ヘッダー部分 */}
        <Hetter />
        {/* メイン画面*/}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            backgroundColor: "",
          }}
        >
          <Input />
          <View
            style={{
              width: "100%",
              height: "38%",
              backgroundColor: "",
              paddingHorizontal: "5%",
              paddingTop: "5%",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {yestselectedDatte(selectedDate)} の日記:
            </Text>
            <Text style={{ marginTop: 10, fontSize: 18 }}>{diaryText}</Text>
          </View>
        </View>
        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default inputPase;
