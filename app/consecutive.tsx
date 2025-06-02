import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Entypo } from "@expo/vector-icons";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const currentStreak = 1;
const todayIndex = 0; // 0 = 日曜日

export default function StreakDisplay() {
  return (
    <View style={styles.container}>
      <Text style={styles.streakNumber}>{currentStreak}</Text>
      <Text style={styles.streakLabel}>日連続記録</Text>

      <View style={styles.daysContainer}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayItem}>
            <Text style={styles.dayText}>{day}</Text>
            <View
              style={[
                styles.circle,
                index === todayIndex
                  ? styles.checkedCircle
                  : styles.emptyCircle,
              ]}
            >
              {index === todayIndex && (
                <Entypo name="check" size={20} color="white" />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
  },
  streakNumber: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FFA500", // オレンジ色
  },
  streakLabel: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA500",
    marginBottom: 20,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dayItem: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  dayText: {
    fontSize: 16,
    color: "#666",
  },
  circle: {
    marginTop: 6,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCircle: {
    backgroundColor: "#E0E0E0",
  },
  checkedCircle: {
    backgroundColor: "#FFA500",
  },
});
