import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const currentStreak = 10;
const todayIndex = new Date().getDay();

export default function StreakDisplay() {
  return (
    <View style={styles.container}>
      {/* 横並びで～日連続記録 */}
      <View style={styles.streakRow}>
        <Text style={styles.streakNumber}>{currentStreak}</Text>
        <Text style={styles.streakLabel}>日連続記録</Text>
      </View>

      {/* 曜日ごとのチェックマーク */}
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
    marginTop: -8, // 全体を少し上に移動
    paddingHorizontal: 10,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "baseline",  // ← ベースライン揃えで完全に同じ行に
    justifyContent: "center",
    marginBottom: 16,
  },
  streakNumber: {
    fontSize: 40, // 少し大きめ
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
    backgroundColor: "#FFDAB9", // 明るいオレンジ系
  },
  checkedCircle: {
    backgroundColor: "#FF7F50", // 明るくて見やすいオレンジ
  },
});
