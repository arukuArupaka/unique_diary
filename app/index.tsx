import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Hetter from "./hetter";
import Hutter from "./hutter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSuggestion } from "../components/Suggestion_Section";
import Input from "@/components/Input";
const Index = () => {
  const now = new Date();
  const navigation = useNavigation();
  const router = useRouter();
  const [diaryText, setDiaryText] = useState(""); // 日記の入力内容を保持する状態
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
  const handleSave = async () => {
    //保存機能
    if (diaryText.trim() === "") {
      //空白かどうか見る
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }

    try {
      const today = new Date();
      const key = `diary-${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`; //keyをdiary-YYYY-M-Dかたちでつくる
      await AsyncStorage.setItem(key, diaryText); //ストレージに保存

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
          {/* 入力部分 */}
          <Input />

          {/*連続記録*/}
          {/* 連続記録 */}
          <View
            //  onPress={() => {
            //  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            // }}
            style={{
              width: "100%",
              height: "40%",
              //alignItems: "center",
              //justifyContent: "center",
              backgroundColor: "",
            }}
          >
            <TouchableOpacity
              style={{
                width: "25%",
                height: "45%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "",
                marginHorizontal: "37%",
              }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              }}
            >
              <FontAwesome5 name="fire" size={100} color="orange" />
            </TouchableOpacity>
            <View
              style={{
                width: "100%",
                height: "45%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
                flexDirection: "row",
              }}
            >
              <View>
                {/* ここでdaysとtodayIndexを定義 */}
                {(() => {
                  const days = ["月", "火", "水", "木", "金", "土", "日"];
                  const today = new Date();
                  const todayIndex =
                    today.getDay() === 0 ? 6 : today.getDay() - 1; // 月曜始まり
                  return (
                    <View style={styles.daysContainer}>
                      {days.map((day, index) => (
                        <View key={index} style={styles.dayItem}>
                          <Text style={styles.dayText}>{day}</Text>
                          <View
                            style={[
                              styles.circle,
                              index === todayIndex
                                ? styles.checkedCircle
                                : styles.emptyCircle,
                            ]}
                          >
                            {index === todayIndex && (
                              <Entypo name="check" size={20} color="white" />
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  );
                })()}
              </View>
            </View>
          </View>
        </View>

        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;

////////////////////////////////////////////////
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  dayItem: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  dayText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#fff",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  checkedCircle: {
    backgroundColor: "orange",
    borderColor: "orange",
  },
  emptyCircle: {
    backgroundColor: "transparent",
    borderColor: "#fff",
  },
}); ///////////////////////////////////////

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // 軽め
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // 主にこれ使ってます
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // 重め

//npx expo install expo-haptics(音に関するやつ)
