import React from "react";
import { View } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { useSelectedDate } from "../data/DateContext";

type Props = {
  onDateSelected: (date: string) => void; //??ここで渡してる？
  selectedDate: string; //??
};

export default function CustomCalendar({
  onDateSelected,
  selectedDate,
}: Props) {
  return (
    <View
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
          onDateSelected(day.dateString); //ここで親に日付を渡す??
        }}
        markedDates={
          //なんかかける
          {
            [selectedDate]: {
              selected: true,
              selectedColor: "#4db5ff",
              selectedTextColor: "#fff",
            },
          }
        }
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
