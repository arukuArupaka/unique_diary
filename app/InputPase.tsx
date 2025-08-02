import Input from "@/components/Input";
import {
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Text,
  Image,
} from "react-native";
import Hetter from "./header";
import Hutter from "./footer";
import { useSelectedDate } from "@/data/DateContext";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import ContionuousIcon from "@/components/ContionuousIcon";

const inputPase = () => {
  const { selectedDate, setSelectedDate } = useSelectedDate(); // setSelectedDate も取得
  const [diaryText, setDiaryText] = useState("");

  // 今日の日付を yyyy-mm-dd形式で取得する関数
  const getTodayString = (): string => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

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
    if (!selectedDate) {
      const today = getTodayString();
      setSelectedDate(today);
    } else {
    }
  }, [selectedDate, setSelectedDate]);

  // selectedDateが変わったら該当日の日記をAsyncStorageから読み込む
  useEffect(() => {
    if (!selectedDate) return; // selectedDateがまだ無ければ何もしない

    const loadDiaryForDate = async () => {
      try {
        const key = yestdayDateKey(selectedDate);
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
          backgroundColor: "#f8f8ff",
        }}
      >
        {/* ヘッダー部分 */}
        <Hetter />
        {/* メイン画面 */}

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Input />
          {selectedDate === getTodayString() ? (
            <ContionuousIcon />
          ) : (
            <View
              style={{
                width: "100%",
                height: "38%",
                paddingHorizontal: "5%",
                paddingTop: "5%",
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
                  {selectedDate ? yestselectedDatte(selectedDate) : ""}{" "}
                  の日記だよ
                </Text>
                <ScrollView style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 18 }}>{diaryText}</Text>
                </ScrollView>
              </View>
            </View>
            // <Image
            //   source={require("../assets/images/StepiReviewToYesterday.png")}
            //   style={{
            //     position: "absolute",
            //     left: 0,
            //     bottom: 0,
            //     width: 90,
            //     height: 90,
            //     resizeMode: "contain",
            //     marginLeft: 5,
            //     marginBottom: 5,
            //   }}
            // />
          )}
        </View>
        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default inputPase;
