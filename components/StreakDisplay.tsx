import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const currentStreak = 10;
const todayIndex = new Date().getDay();

export default function StreakDisplay() {
  return (
    <View style={styles.container}>
      <Text style={styles.streakNumber}>{currentStreak}</Text>
      <Text style={styles.streakLabel}>日連続記録</Text>

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
                {isToday && <Entypo name="check" size={18} color="#fff" />}
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
    marginTop: 45,
    paddingHorizontal: 20,
  },
  streakNumber: {
    fontSize: 68,
    fontWeight: "bold",
    color: "#FF6B35", // オレンジ系の色（少し赤みのあるオレンジ）
  },
  streakLabel: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000", // 黒色
    marginBottom: 28,
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
    fontSize: 16,
    color: "#444",
    marginBottom: 6,
  },
  todayText: {
    fontWeight: "700",
    color: "#3B3B3B",
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  emptyCircle: {
    backgroundColor: "#CCC",
  },
  checkedCircle: {
    backgroundColor: "#3B3B3B",
  },
});
