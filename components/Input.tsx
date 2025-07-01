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
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Entypo from "@expo/vector-icons/Entypo";

const Input = () => {
  const [diaryText, setDiaryText] = useState("");
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
  const { selectedDate } = useSelectedDate();
  const pathname = usePathname();
  const [suggestionwhole, setsuggestionwhole] = useState(false);

  const getTodayString = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().split("T")[0];
  };

  const isValidDateString = (dateStr: string) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  };

  const updateStreak = async (dateStr: string) => {
    try {
      const today = getTodayString();
      if (dateStr !== today) return; // 今日以外の日付は無視

      const storedDates = await AsyncStorage.getItem("logDates");
      let dateArray: string[] = storedDates ? JSON.parse(storedDates) : [];

      const dateSet = new Set(dateArray);

      if (!dateSet.has(dateStr)) {
        dateSet.add(dateStr);
        dateArray = Array.from(dateSet).sort();
        await AsyncStorage.setItem("logDates", JSON.stringify(dateArray));
      } else {
        return;
      }

      let streak = 0;
      let currentDate = new Date(dateStr);

      while (true) {
        const checkStr = currentDate.toISOString().split("T")[0];
        if (dateSet.has(checkStr)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      await AsyncStorage.setItem("streakCount", streak.toString());
      await AsyncStorage.setItem("streakAnimationDate", dateStr);
    } catch (error) {
      console.error("連続記録の更新中にエラー:", error);
    }
  };

  const handleSave = async () => {
    if (diaryText.trim() === "") {
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }

    const saveDiaryTime = async () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const historyRaw = await AsyncStorage.getItem("diary-time-history");
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      const updatedHistory = [...history, { hour, minute }].slice(-30);
      await AsyncStorage.setItem(
        "diary-time-history",
        JSON.stringify(updatedHistory)
      );
    };

    const dateToSave =
      pathname === "/InputPase" && isValidDateString(selectedDate)
        ? selectedDate
        : getTodayString();

    const formatDateKey = (dateString: string) => {
      const [year, month, day] = dateString.split("-");
      return `diary-${parseInt(year)}-${parseInt(month)}-${parseInt(day)}`;
    };

    try {
      await saveDiaryTime();

      const key = formatDateKey(dateToSave);
      await AsyncStorage.setItem(key, diaryText);

      await updateStreak(dateToSave);

      Alert.alert("保存完了", "日記が保存されました");
      setDiaryText("");
      setsuggestionwhole(false);
    } catch (error) {
      Alert.alert("保存失敗", "データの保存中にエラーが発生しました");
      console.error(error);
    }
  };

  const handlePress = () => {
    setsuggestionwhole((prev) => !prev);
  };

  return (
    <View style={{ backgroundColor: "", height: "58%" }}>
      <TextInput
        style={{
          borderWidth: 0,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          height: "50%",
          textAlignVertical: "top",
          backgroundColor: "#fff",
          marginBottom: 0,
          fontSize: 20,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
        placeholder={
          pathname === "/InputPase"
            ? `${selectedDate}の日記を書いてね`
            : "今日はどんな日だった？"
        }
        multiline
        scrollEnabled={true}
        value={diaryText}
        onChangeText={setDiaryText}
      />

      <View style={{ flexDirection: "row", width: "100%", height: "44%" }}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            height: "100%",
            backgroundColor: "#fff",
            borderRadius: 8,
            marginTop: "6%",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {suggestionwhole ? (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handlePress();
              }}
              style={{
                width: "82%",
                marginTop: "2%",
                marginLeft: "2%",
                gap: "4%",
                backgroundColor: "",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>日々</Text>
              <Text style={{ fontSize: 17, color: "#777" }}>
                {DailySuggestion}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>大学生活</Text>
              <Text style={{ fontSize: 17, color: "#777" }}>
                {CollegeSuggestion}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>人生</Text>
              <Text style={{ fontSize: 17, color: "#777" }}>
                {LifeSuggestion}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handlePress}
              style={{
                width: "82%",
                justifyContent: "center",
                alignItems: "center",
                paddingLeft: "10%",
                marginLeft: "2%",
                backgroundColor: "",
              }}
            >
              <Text style={{ fontSize: 16, color: "#555" }}>
                タップしてヒントを見る💡
              </Text>
            </TouchableOpacity>
          )}
          <View
            style={{
              marginTop: "1%",
              marginLeft: "-2%",
              gap: "4%",
              width: "15%",
              height: "65%",
              borderRadius: 30,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleSave();
              }}
              style={{
                width: 70,
                height: 55,
                borderRadius: 100,
                justifyContent: "center",
                paddingTop: "12%",
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
                paddingRight: 8,
              }}
            >
              <MaskedView
                style={{ width: "100%", height: "100%" }}
                maskElement={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="save" size={47} color="#fff" />
                  </View>
                }
              >
                <LinearGradient
                  colors={["#58baff", "#d2ecff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 2, y: 1 }}
                  style={{ width: "100%", height: "100%" }}
                />
              </MaskedView>
            </TouchableOpacity>

            {suggestionwhole && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleSwap();
                }}
                style={{
                  width: 70,
                  height: 55,
                  borderRadius: 100,
                  justifyContent: "center",
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                  paddingRight: 8,
                }}
              >
                <MaskedView
                  style={{ width: "100%", height: "100%" }}
                  maskElement={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="reload"
                        size={54}
                        color="#fff"
                      />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={["#58baff", "#d2ecff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 1 }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </MaskedView>
              </TouchableOpacity>
            )}

            {/* {suggestionwhole && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handlePress();
                }}
                style={{
                  backgroundColor: "",
                  width: 78,
                  height: 55,
                  borderRadius: 100,
                  justifyContent: "center",
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaskedView
                  style={{ width: "100%", height: "100%" }}
                  maskElement={
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                      }}
                    >
                      <AntDesign name="close" size={57} color="#fff" />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={["#ff6a6a", "#ff4747"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 1 }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </MaskedView>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Input;
