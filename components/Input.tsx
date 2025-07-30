import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native"; // [change] StyleSheet 追加（ヘアライン区切りで使用）
import React, { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSuggestion } from "../components/Suggestion_Section";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, usePathname } from "expo-router";
import { useSelectedDate } from "@/data/DateContext";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import Entypo from "@expo/vector-icons/Entypo";
import { whatDayList } from "@/data/whatDayList";
import * as Font from "expo-font";

const Input = () => {
  const [diaryText, setDiaryText] = useState("");
  const [content, setContent] = useState("");
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
  const { selectedDate } = useSelectedDate();
  const pathname = usePathname();
  const [suggestionwhole, setsuggestionwhole] = useState(false);

  const getTodayKey = () => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().slice(5, 10); // "MM-DD"　  /** JST の MM-DD 文字列を返す */
  };
  const todaySpecial = whatDayList[getTodayKey()] ?? null; //nullは念のため

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

  useFocusEffect(
    useCallback(() => {
      const isTodayDiaryFilled = async () => {
        try {
          const today = new Date();
          const key = `diary-${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;
          const text = await AsyncStorage.getItem(key);
          setContent(
            !text || text.trim() === ""
              ? "今日の出来事を言葉にしよう"
              : "お疲れ様明日も頑張ろう！"
          );
        } catch (error) {
          setContent("読み込みエラー");
          console.error("日記読み込み失敗:", error);
        }
      };

      const isDiaryFilled = async () => {
        try {
          const date = new Date(selectedDate);
          const key = `diary-${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`;
          const text = await AsyncStorage.getItem(key);
          setContent(
            !text || text.trim() === ""
              ? "ちょっと思い出してみようか。"
              : "お疲れ様明日も頑張ろう！"
          );
        } catch (error) {
          setContent("読み込みエラー");
          console.error("日記読み込み失敗:", error);
        }
      };

      pathname === "/InputPase" && isValidDateString(selectedDate)
        ? isDiaryFilled()
        : isTodayDiaryFilled();
    }, [])
  );

  return (
    <View style={{ backgroundColor: "", height: "58%" }}>
      {/* 上段：入力ボックス */}
      <View
        style={{
          height: "50%",
          backgroundColor: "#fff",
          borderRadius: 8,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <TextInput
          style={{
            height: "100%",
            padding: 12,
            paddingRight: 30,
            textAlignVertical: "top",
            fontSize: 20,
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
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSave();
          }}
          style={{
            position: "absolute",
            right: 6,
            bottom: 2,
            width: 30,
            height: 50,
            borderRadius: 25,
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
                <MaterialCommunityIcons name="send" size={35} color="black" />
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
      </View>

      {/* 下段：提案カード／今日は●●です */}
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
            position: "relative", // [change] 右上ボタンを重ねるため
          }}
        >
          {suggestionwhole ? (
            <View
              style={{
                width: "82%",
                marginTop: "0%",
                marginLeft: "3%",
                gap: "4%",
                position: "relative",
                paddingTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setsuggestionwhole(false);
                }}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  top: -9,
                  left: -18,
                  zIndex: 1,
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
                      <AntDesign name="closecircleo" size={24} color="black" />
                    </View>
                  }
                >
                  <LinearGradient
                    colors={["#ff5a5a", "#ff8282"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 2, y: 1 }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </MaskedView>
              </TouchableOpacity>

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
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setsuggestionwhole(true)}
              style={{
                width: "100%", // [change] 本文は全面に
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginLeft: 0,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: "#444",
                    fontWeight: "600",
                    lineHeight: 26,
                    textAlign: "center",
                    includeFontPadding: false,
                    marginTop: 6,
                  }}
                  numberOfLines={2}
                >
                  {content}
                </Text>

                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 8,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: "#E9EEF3",
                  }}
                />

                {todaySpecial && (
                  // [change] 左／中央（大きめ）／右 の3段構成
                  <View style={{ paddingVertical: 6 }}>
                    {/* 左寄せ：今日は */}
                    <View style={{ alignItems: "flex-start" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#111",
                          fontWeight: "400",
                          includeFontPadding: false,
                        }}
                      >
                        今日は
                      </Text>
                    </View>

                    {/* 中央：●●（大きく） */}
                    <View style={{ alignItems: "center", marginVertical: 2 }}>
                      <Text
                        style={{
                          fontSize: 25, // [change] ●●のみ大きめ
                          fontWeight: "800",
                          color: "#222",
                          includeFontPadding: false,
                        }}
                      >
                        「{todaySpecial}」
                      </Text>
                    </View>

                    {/* 右寄せ：です🐧 */}
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#111",
                          fontWeight: "450",
                          includeFontPadding: false,
                        }}
                      >
                        です🐧
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* 右上ボタン群：absoluteで重ねる（テキストが下に食い込める） */}
          <View
            style={{
              position: "absolute", // [change]
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            {!suggestionwhole ? (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setsuggestionwhole(true);
                }}
                style={{
                  width: 56,
                  height: 55,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
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
                      <AntDesign
                        name="questioncircleo"
                        size={46}
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
            ) : (
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
          </View>
        </View>
      </View>
    </View>
  );
};

export default Input;
