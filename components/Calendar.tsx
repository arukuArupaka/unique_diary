// components/CustomCalendar.tsx

import React from "react";
import { View, Text } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

export default function Calendar() {
  return (
    <View //なんかダサいから変えたい。
      style={{
        marginTop: 0,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <RNCalendar
        onDayPress={(day) => {
          console.log(day.dateString); //↓押された日にちの日記を出す。
        }}
        markedDates={{
          "2025-05-25": {
            selected: true,
            marked: true,
            selectedColor: "#4db5ff",
          },
          "2025-05-21": {
            marked: true,
            dotColor: "#4db5ff",
          },
        }}
        //なぜstyleが効かないのか
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#f8f9fa",
          textSectionTitleColor: "#6c757d",
          selectedDayBackgroundColor: "#4db5ff",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#4db5ff",
          dayTextColor: "#212529",
          textDisabledColor: "#ced4da",
          arrowColor: "#4db5ff",
          monthTextColor: "#4db5ff",
          indicatorColor: "#4db5ff",
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "500",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
}
