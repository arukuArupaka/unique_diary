import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Hetter from "../hetter";  // ✅ 正しいパスに修正
import Hutter from "../hutter";  // ✅ 正しいパスに修正

type StreakRecord = {
  date: string; // 形式: "YYYY-MM-DD"
  wrote: boolean;
};

const HistoryMonthly = () => {
  const [monthlyStats, setMonthlyStats] = useState<{
    month: string;
    daysWritten: number;
    longestStreak: number;
  } | null>(null);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        const json = await AsyncStorage.getItem("streakHistory");
        if (!json) return;

        const history: StreakRecord[] = JSON.parse(json);
        if (history.length === 0) return;

        // 今月の年月文字列（例: 2025-06）
        const now = new Date();
        const monthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

        // 今月の履歴を抽出
        const thisMonthRecords = history.filter((rec) => rec.date.startsWith(monthStr));

        // 書いた日数
        const daysWritten = thisMonthRecords.filter((rec) => rec.wrote).length;

        // 最長ストリーク計算
        let longestStreak = 0;
        let currentStreak = 0;
        let prevDate: Date | null = null;

        for (const rec of thisMonthRecords.sort((a, b) => a.date.localeCompare(b.date))) {
          if (rec.wrote) {
            const currentDate = new Date(rec.date);
            if (
              prevDate &&
              (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24) === 1
            ) {
              currentStreak++;
            } else {
              currentStreak = 1;
            }

            if (currentStreak > longestStreak) {
              longestStreak = currentStreak;
            }

            prevDate = currentDate;
          } else {
            currentStreak = 0;
            prevDate = null;
          }
        }

        setMonthlyStats({ month: monthStr, daysWritten, longestStreak });
      } catch (e) {
        console.warn("月別統計の読み込み失敗", e);
      }
    };

    calculateStats();
  }, []);

  return (
    <View style={styles.container}>
      <Hetter />
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
      <Hutter />
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
