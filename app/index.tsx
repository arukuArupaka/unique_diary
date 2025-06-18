import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Hetter from "./hetter";
import Hutter from "./hutter";
import Input from "@/components/Input";
import { useSuggestion } from "../components/Suggestion_Section";
import StreakDisplay from "../components/StreakDisplay";
import ContionuousIcon from "@/components/ContionuousIcon";

const Index = () => {
  const now = new Date();
  const navigation = useNavigation();
  const router = useRouter();
  const [diaryText, setDiaryText] = useState("");

  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();

  const [suggestionwhole, setsuggestionwhole] = useState(false);

  const handlePress = () => {
    setsuggestionwhole((prev) => !prev);
  };

  const handleSave = async () => {
    if (diaryText.trim() === "") {
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }

    try {
      const today = new Date();
      const key = `diary-${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      await AsyncStorage.setItem(key, diaryText);

      Alert.alert("保存完了", "日記が保存されました");
      setDiaryText("");
    } catch (error) {
      Alert.alert("保存失敗", "データの保存中にエラーが発生しました");
      console.error(error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Hetter />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
          }}
        >
          <Input />

          {/* 🔥 連続記録セクション */}
          <ContionuousIcon />
        </View>

        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;
