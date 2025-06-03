import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import * as Haptics from "expo-haptics";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSuggestion } from "../components/Suggestion_Section";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePathname } from "expo-router";
import { useSelectedDate } from "@/data/DateContext";
import inputPase from "@/app/InputPase";

const Input = () => {
  const [diaryText, setDiaryText] = useState(""); // 日記の入力内容を保持する状態
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
  const { selectedDate } = useSelectedDate();
  const pathname = usePathname();
  const handleSave = async () => {
    //保存機能
    if (diaryText.trim() === "") {
      //空白かどうか見る
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }
    const saveDiaryTime = async () => {
      //入力したときの時間を記録する。仕組み！
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      //historyは履歴の意味で
      const historyRaw = await AsyncStorage.getItem("diary-time-history"); //key設定？
      const history = historyRaw ? JSON.parse(historyRaw) : []; //配列にする。

      // 最大30件に制限（古いものから削除）
      const updatedHistory = [...history, { hour, minute }].slice(-30);
      await AsyncStorage.setItem(
        "diary-time-history",
        JSON.stringify(updatedHistory)
      );
    };

    const formatDateKey = (dateString: string) => {
      //YYYY-0M-0Dの０を消している
      const [year, month, day] = dateString.split("-");
      return `diary-${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`; //paeseIntで0を消している
    };

    try {
      await saveDiaryTime();

      const today = new Date();
      const key = `diary-${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`; //keyをdiary-YYYY-M-Dかたちでつくる
      if (pathname === "/InputPase") {
        await AsyncStorage.setItem(formatDateKey(selectedDate), diaryText); //選択した日付のkey
      } else {
        await AsyncStorage.setItem(key, diaryText); //今日の日付のkey
      }

      Alert.alert("保存完了", "日記が保存されました");
      setDiaryText(""); //入力欄を空にする
    } catch (error) {
      Alert.alert("保存失敗", "データの保存中にエラーが発生しました");
      console.error(error);
    }
  };

  const [suggestionwhole, setsuggestionwhole] = useState(false);
  const handlePress = () => {
    setsuggestionwhole((prev) => !prev); // 見える見えないを変える
  };

  return (
    <View style={{ backgroundColor: "", height: "58%" }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        {pathname === "/InputPase" ? `${selectedDate}の日記` : "今日の日記"}
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          height: 150,
          textAlignVertical: "top",
          backgroundColor: "#fff",
          marginBottom: 0,
          fontSize: 20,
          shadowOffset: { width: 0, height: 3 }, //影の位置大きいとしたに行く
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
        placeholder={
          pathname === "/InputPase"
            ? `${selectedDate}の日記を書いてね` //選択した日付が出る
            : "今日はどんな一日だった？"
        }
        multiline
        value={diaryText}
        onChangeText={setDiaryText}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          borderColor: "#ccc",
          borderWidth: 0,
        }}
      ></View>
      {/*　提案機能のボタン */}

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: "50%",
          backgroundColor: "",
        }}
      >
        <View
          style={{
            width: "88%",
            height: "100%",
            backgroundColor: "",
          }}
        >
          {/*提案機能の文章自体*/}
          {suggestionwhole && (
            <View
              style={{
                width: "100%",
                height: "90%",
                backgroundColor: "#ffffff",
                borderColor: "#ccc",
                borderWidth: 0,
                borderRadius: 8,
                marginTop: "6%",
                gap: 6,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
                paddingHorizontal: "4%",
                paddingVertical: "2.5%",
              }}
            >
              {/*　
                  
                  
                  お願いしますｍ（_ _）ｍ

                  ここ変えて↓ 
                  
                  
                  */}
              {/*ランダムで変わる部分です。*/}
              <Text style={{ fontSize: 15, color: "red" }}>日々</Text>
              {/*↑これ消してもいい。色は仮見やすくしたいから */}

              <Text style={{ fontSize: 18 }}>{DailySuggestion}</Text>

              <Text style={{ fontSize: 15, color: "red" }}>大学生活</Text>
              {/*↑これ消してもいい */}

              <Text style={{ fontSize: 18 }}>{CollegeSuggestion}</Text>

              <Text style={{ fontSize: 15, color: "red" }}>人生</Text>
              {/*↑これ消してもいい */}

              <Text style={{ fontSize: 18 }}> {LifeSuggestion}</Text>
            </View>
          )}
        </View>
        {/*ボタン自体*/}
        <View
          style={{
            width: "20%",
            height: "90%",
            gap: "4%",
            borderColor: "#ccc",
            borderWidth: 0,
            marginTop: "4%",
            paddingBottom: "0%",
            backgroundColor: "",
          }}
        >
          <TouchableOpacity //保存ボタン
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSave();
            }}
            style={{
              width: "100%",
              height: "32%",
              backgroundColor: "",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0%",
              paddingTop: "12%",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
              paddingRight: 9,
            }}
          >
            <Feather name="save" size={47} color="#4db5ff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleSwap();
            }}
            style={{
              width: "100%",
              height: "32%",
              backgroundColor: "",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              marginTop: "0%",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
              paddingRight: 5,
            }}
          >
            <MaterialCommunityIcons //リロードマークの
              name="reload"
              size={54}
              color="red"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handlePress();
            }}
            style={{
              width: "80%",
              height: "32%",
              backgroundColor: "",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
              paddingLeft: 7,
            }}
          >
            <AntDesign name="questioncircleo" size={48} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Input;
