import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import * as Haptics from "expo-haptics";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSuggestion } from "../components/Suggestion_Section";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { whatDayList } from "@/data/whatDayList";
import { supabase } from "../lib/supabase";

const Input = () => {
  const getTodayString = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().split("T")[0];
  };

  const params = useLocalSearchParams();
  const entryDate = (params.entryDate as string) || getTodayString();

  const [diaryText, setDiaryText] = useState("");
  const [content, setContent] = useState("");
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
  const [suggestionwhole, setsuggestionwhole] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getTodayKey = () => {
    const now = new Date();
    now.setHours(now.getHours() + 9);
    return now.toISOString().slice(5, 10);
  };
  const todaySpecial = whatDayList[getTodayKey()] ?? null;

  const updateStreak = async (dateStr: string) => {
    try {
      const today = getTodayString();
      if (dateStr !== today) return;

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

  useFocusEffect(
    useCallback(() => {
      const loadDiary = async () => {
        if (!entryDate) return;
        try {
          const key = `diary-${entryDate}`;
          const text = await AsyncStorage.getItem(key);
          setDiaryText(text || "");
          setContent(
            !text || text.trim() === ""
              ? "今日の出来事を言葉にしよう"
              : "お疲れ様明日も頑張ろう！"
          );
        } catch (error) {
          console.error("日記の読み込みエラー:", error);
          Alert.alert("エラー", "日記の読み込みに失敗しました。");
        }
      };
      loadDiary();
    }, [entryDate])
  );

  const handleSave = async () => {
    if (diaryText.trim() === "") {
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }
    setIsSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert(
        "ログインが必要です",
        "日記をオンラインに保存するには、ログインが必要です。"
      );
      setIsSaving(false);
      return;
    }

    const dateToSave = entryDate;

    try {
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
      await saveDiaryTime();

      const key = `diary-${dateToSave}`;
      await AsyncStorage.setItem(key, diaryText);

      const { error: upsertError } = await supabase
        .from("diaries")
        .upsert(
          { user_id: user.id, entry_date: dateToSave, content: diaryText },
          { onConflict: "user_id, entry_date" }
        );
      if (upsertError) throw upsertError;

      const isToday = dateToSave === getTodayString();
      if (isToday) {
        const { data: feedbackData, error: feedbackError } =
          await supabase.functions.invoke("generate-feedback", {
            body: { diaryText: diaryText },
          });
        if (feedbackError) throw feedbackError;

        if (feedbackData.feedback) {
          const { error: updateError } = await supabase
            .from("diaries")
            .update({ feedback: feedbackData.feedback })
            .match({ user_id: user.id, entry_date: dateToSave });
          if (updateError) throw updateError;
        }

        const { error: rpcError } = await supabase.rpc("update_user_stats");
        if (rpcError) throw rpcError;
      }

      await updateStreak(dateToSave);

      Alert.alert("保存完了", "日記が保存されました");
      setDiaryText("");
      setsuggestionwhole(false);
    } catch (error) {
      console.error("保存プロセス全体のエラー:", error);
      Alert.alert("エラー", "処理中にエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={{ backgroundColor: "", height: "58%" }}>
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
            paddingRight: 40,
            textAlignVertical: "top",
            fontSize: 20,
          }}
          placeholderTextColor="#999"
          placeholder={
            entryDate === getTodayString()
              ? "今日はどんな日だった？"
              : `${entryDate}の日記を書いてね`
          }
          multiline
          scrollEnabled={true}
          onChangeText={setDiaryText}
        />
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSave();
          }}
          disabled={isSaving}
          style={{
            position: "absolute",
            right: 6,
            bottom: 2,
            width: 40,
            height: 50,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#58baff" />
          ) : (
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
          )}
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", width: "100%", height: "48%" }}>
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
            position: "relative",
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
                width: "100%",
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
                  <View style={{ paddingVertical: 6 }}>
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
                    <View style={{ alignItems: "center", marginVertical: 2 }}>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "800",
                          color: "#222",
                          includeFontPadding: false,
                        }}
                      >
                        「{todaySpecial}」
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: "#111",
                          fontWeight: "400",
                          includeFontPadding: false,
                        }}
                      >
                        です
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          <View
            style={{
              position: "absolute",
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
