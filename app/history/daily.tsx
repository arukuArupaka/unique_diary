import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";

type Entry = {
  date: string;
  content: string;
};

const DailyHistory = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const diaryKeys = allKeys.filter((key) => key.startsWith("diary-"));
        const diaryEntries = await AsyncStorage.multiGet(diaryKeys);

        const parsedEntries = diaryEntries.map(([key, value]) => {
          const date = key.replace("diary-", "");
          let displayText = "";
          if (value) {
            try {
              const parsed = JSON.parse(value);
              if (typeof parsed === "object" && parsed !== null && "text" in parsed) {
                displayText = parsed.text;
              } else {
                displayText = value;
              }
            } catch {
              displayText = value;
            }
          }
          return { date, content: displayText };
        });

        // 日付の昇順にソート（古い順）
        parsedEntries.sort((a, b) => (a.date > b.date ? 1 : -1));
        setEntries(parsedEntries);

        // 最大連続記録計算
        let maxStreakCount = 0;
        let currentStreak = 0;
        let prevDate: dayjs.Dayjs | null = null;

        parsedEntries.forEach(({ date }) => {
          const currentDate = dayjs(date);
          if (prevDate) {
            if (currentDate.diff(prevDate, "day") === 1) {
              currentStreak++;
            } else {
              if (currentStreak > maxStreakCount) maxStreakCount = currentStreak;
              currentStreak = 1;
            }
          } else {
            currentStreak = 1;
          }
          prevDate = currentDate;
        });

        if (currentStreak > maxStreakCount) maxStreakCount = currentStreak;

        setMaxStreak(maxStreakCount);
      } catch (error) {
        console.error("履歴の読み込みに失敗:", error);
      }
    };

    loadEntries();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📅 日別履歴</Text>
      {/* 最大連続記録日数を改行して表示 */}
      <Text style={styles.streak}>
        {"🔥 過去の最大連続記録日数:\n" + maxStreak + " 日"}
      </Text>
      {entries.length === 0 ? (
        <Text style={styles.empty}>まだ日記がありません</Text>
      ) : (
        entries.map((entry) => (
          <View key={entry.date} style={styles.entry}>
            <Text style={styles.date}>{entry.date}</Text>
            {/* 改行を反映 */}
            <Text style={styles.content}>
              {entry.content.split("\n").map((line, i) => (
                <Text key={i}>
                  {line}
                  {i < entry.content.split("\n").length - 1 && "\n"}
                </Text>
              ))}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  streak: {
    fontSize: 60,
    fontWeight: "900",
    marginBottom: 24,
    color: "tomato",
    textAlign: "center",
    lineHeight: 70, // 改行時の行間調整
  },
  empty: {
    fontSize: 18,
    color: "gray",
  },
  entry: {
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  content: {
    fontSize: 16,
  },
});

export default DailyHistory;
