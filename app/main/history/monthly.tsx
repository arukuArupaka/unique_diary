import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

type DiaryEntry = {
  date: string; // ex: "2025-6-23"
  content: string;
};

const screenWidth = Dimensions.get("window").width;

const HistoryMonthlyGraph = () => {
  const [daysWritten, setDaysWritten] = useState(0);
  const [logDates, setLogDates] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [monthStr, setMonthStr] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        // 今の年月（例: 2025-6）
        const now = dayjs();
        const thisMonthStr = `${now.year()}-${now.month() + 1}`;
        setMonthStr(thisMonthStr);

        // キー取得
        const allKeys = await AsyncStorage.getAllKeys();
        const diaryKeys = allKeys.filter((k) => k.startsWith("diary-"));

        // 対象月のキーだけ抽出し、日付配列作成
        const filteredDates: string[] = [];
        for (const key of diaryKeys) {
          // key: diary-YYYY-M-D
          const dateStr = key.replace("diary-", ""); // ex: "2025-6-23"
          if (dateStr.startsWith(thisMonthStr)) {
            filteredDates.push(dateStr);
          }
        }

        setLogDates(filteredDates);
        setDaysWritten(filteredDates.length);

        // 連続記録（保存済み値をAsyncStorageから取得）
        const streakRaw = await AsyncStorage.getItem("streakCount");
        setStreakCount(streakRaw ? parseInt(streakRaw, 10) : 0);
      } catch (e) {
        console.warn("統計読み込みエラー", e);
      }
    };
    loadStats();
  }, []);

  // 棒グラフ幅の最大を画面幅の8割に設定
  const maxBarWidth = screenWidth * 0.8;
  // 月の日数（今月の最終日）
  const daysInMonth = dayjs(monthStr + "-01").daysInMonth();

  // 書いた日数の割合（0~1）
  const ratio = daysWritten / daysInMonth;
  const barWidth = maxBarWidth * ratio;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 {monthStr} の月別統計</Text>
      <View style={styles.statsCard}>
        <Text style={styles.statText}>この月の日記を書いた日数: {daysWritten}日 / {daysInMonth}日</Text>

        <View style={styles.barBackground}>
          <View style={[styles.barFill, { width: barWidth }]} />
        </View>

        <Text style={styles.statText}>現在の連続記録: {streakCount}日</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f3f5", paddingTop: 40 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },
  statText: {
    fontSize: 18,
    marginVertical: 10,
  },
  barBackground: {
    width: "80%",
    height: 24,
    backgroundColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 10,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#4db5ff",
    borderRadius: 12,
  },
});

export default HistoryMonthlyGraph;
