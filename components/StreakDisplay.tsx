import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const todayIndex = new Date().getDay();

export default function StreakDisplay() {
  const [streak, setStreak] = useState(0);
  const [checkedWeekdays, setCheckedWeekdays] = useState<number[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const prevStreakRef = useRef<number | null>(null);

  // アニメーション
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.6,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "2025-06-06"
  };

  const checkAndUpdateStreak = async () => {
    try {
      const today = getTodayString();
      const storedDate = await AsyncStorage.getItem("lastLoggedDate");
      const storedStreak = await AsyncStorage.getItem("streakCount");

      const lastDate = storedDate || "";
      const count = storedStreak ? parseInt(storedStreak) : 0;

      // 過去の記録日を取得
      const storedLogDates = await AsyncStorage.getItem("logDates");
      const logDates: string[] = storedLogDates ? JSON.parse(storedLogDates) : [];

      // 今日の記録がまだなければ追加
      if (!logDates.includes(today)) {
        logDates.push(today);
        await AsyncStorage.setItem("logDates", JSON.stringify(logDates));
      }

      // 連続日数の更新
      if (lastDate === today) {
        setStreak(count);
        return;
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split("T")[0];

      let newStreak = 1;
      if (lastDate === yesterdayString) {
        newStreak = count + 1;
      }

      await AsyncStorage.setItem("lastLoggedDate", today);
      await AsyncStorage.setItem("streakCount", newStreak.toString());
      setStreak(newStreak);
    } catch (err) {
      console.error("連続記録の更新エラー:", err);
    }
  };

  const loadThisWeekCheckmarks = async () => {
    try {
      const storedLogDates = await AsyncStorage.getItem("logDates");
      if (!storedLogDates) return;

      const dateArray: string[] = JSON.parse(storedLogDates);

      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // 今週の日曜日
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekdayIndexes = dateArray
        .map((dateStr) => {
          const d = new Date(dateStr);
          if (d >= startOfWeek && d <= endOfWeek) {
            return d.getDay(); // 曜日インデックス
          }
          return null;
        })
        .filter((d): d is number => d !== null);

      // 重複を除いた曜日インデックスを保存
      setCheckedWeekdays([...new Set(weekdayIndexes)]);
    } catch (err) {
      console.error("チェックマーク読み込みエラー:", err);
    }
  };

  useEffect(() => {
    (async () => {
      await checkAndUpdateStreak();
      await loadThisWeekCheckmarks();
    })();
  }, []);

  useEffect(() => {
    if (prevStreakRef.current === null || prevStreakRef.current !== streak) {
      startAnimation();
    }
    prevStreakRef.current = streak;
  }, [streak]);

  return (
    <View style={styles.container}>
      {/* ▼▼▼ 日連続記録の表示部分 ▼▼▼ */}
      <View style={styles.streakRow}>
        <Animated.Text
          style={[styles.streakNumber, { transform: [{ scale: scaleAnim }] }]}
        >
          {streak}
        </Animated.Text>
        <Text style={styles.streakLabel}>日連続記録</Text>
      </View>

      {/* ▼▼▼ 曜日ごとのチェック機能部分 ▼▼▼ */}
      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          const isChecked = checkedWeekdays.includes(index);
          const isToday = index === todayIndex;
          return (
            <View key={index} style={styles.dayItem}>
              <Text style={[styles.dayText, isToday && styles.todayText]}>
                {day}
              </Text>
              <View
                style={[
                  styles.circle,
                  isChecked ? styles.checkedCircle : styles.emptyCircle,
                ]}
              >
                {isChecked && <Entypo name="check" size={16} color="#fff" />}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: -8,
    paddingHorizontal: 10,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 16,
  },
  streakNumber: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FF6B35",
    marginRight: 6,
  },
  streakLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  dayItem: {
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  todayText: {
    fontWeight: "700",
    color: "#3B3B3B",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  emptyCircle: {
    backgroundColor: "#FFDAB9",
  },
  checkedCircle: {
    backgroundColor: "#FF7F50",
  },
});
