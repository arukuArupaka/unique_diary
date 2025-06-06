import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Entypo } from "@expo/vector-icons";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const todayIndex = new Date().getDay();

export default function StreakDisplay() {
  const fixedStreak = 5; // ※現在は固定値（将来的には動的に）

  // アニメーション用のスケール値（最初は1倍）
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 前回の値を保存して比較するためのref
  const prevStreakRef = useRef<number | null>(null);

  // 数字を拡大→元に戻す1回限りのアニメーション
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

  useEffect(() => {
    // 初回または値が変わったときのみアニメーション実行
    if (prevStreakRef.current === null || prevStreakRef.current !== fixedStreak) {
      startAnimation();
    }
    prevStreakRef.current = fixedStreak;
  }, [fixedStreak]);

  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        {/* ★ 数字の部分だけをアニメーション対象にする */}
        <Animated.Text
          style={[styles.streakNumber, { transform: [{ scale: scaleAnim }] }]}
        >
          {fixedStreak}
        </Animated.Text>
        <Text style={styles.streakLabel}>日連続記録</Text>
      </View>

      <View style={styles.daysContainer}>
        {days.map((day, index) => {
          const isToday = index === todayIndex;
          return (
            <View key={index} style={styles.dayItem}>
              <Text style={[styles.dayText, isToday && styles.todayText]}>
                {day}
              </Text>
              <View
                style={[
                  styles.circle,
                  isToday ? styles.checkedCircle : styles.emptyCircle,
                ]}
              >
                {isToday && <Entypo name="check" size={16} color="#fff" />}
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
