import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

const HistoryMonthly = () => {
  const [monthlyStats, setMonthlyStats] = useState<{
    month: string;
    daysWritten: number;
    longestStreak: number;
  } | null>(null);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        // AsyncStorage のキーをすべて取得
        const allKeys = await AsyncStorage.getAllKeys();
        // diary-で始まるキーだけ抽出
        const diaryKeys = allKeys.filter((key) => key.startsWith("diary-"));
        const diaryEntries = await AsyncStorage.multiGet(diaryKeys);

        // 今の年月（例: 2025-06）
        const now = new Date();
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // 今月の日記エントリーだけ抽出し日付を取り出す
        const thisMonthDates = diaryEntries
          .map(([key]) => key.replace("diary-", ""))
          .filter((date) => date.startsWith(monthStr))
          .sort();

        const daysWritten = thisMonthDates.length;

        // 最長連続ストリーク計算
        let longestStreak = 0;
        let currentStreak = 0;
        let prevDate: dayjs.Dayjs | null = null;

        thisMonthDates.forEach((date) => {
          const currentDate = dayjs(date);
          if (prevDate) {
            if (currentDate.diff(prevDate, "day") === 1) {
              currentStreak++;
            } else {
              if (currentStreak > longestStreak) longestStreak = currentStreak;
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }
          prevDate = currentDate;
        });

        if (currentStreak > longestStreak) longestStreak = currentStreak;

        setMonthlyStats({ month: monthStr, daysWritten, longestStreak });
      } catch (e) {
        console.warn("月別統計の読み込み失敗", e);
      }
    };

    calculateStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>月別統計</Text>
      {monthlyStats ? (
        <View style={styles.card}>
          <Text style={styles.text}>{monthlyStats.month} の統計</Text>
          <Text style={styles.text}>この月は {monthlyStats.daysWritten} 日書きました</Text>
          <Text style={styles.text}>今月の最長ストリークは {monthlyStats.longestStreak} 日</Text>
        </View>
      ) : (
        <Text style={styles.text}>統計情報がありません</Text>
      )}
    </View>
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
  card: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    marginVertical: 6,
  },
});

export default HistoryMonthly;
