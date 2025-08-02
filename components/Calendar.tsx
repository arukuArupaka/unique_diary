import React from "react";
import { View } from "react-native";
import { Calendar as RNCalendar, LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["ja"] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: [
    "日曜日",
    "月曜日",
    "火曜日",
    "水曜日",
    "木曜日",
    "金曜日",
    "土曜日",
  ],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};
LocaleConfig.defaultLocale = "ja";

type Props = {
  onDateSelected: (date: string) => void;
  selectedDate: string;
};

export default function CustomCalendar({
  onDateSelected,
  selectedDate,
}: Props) {
  return (
    <View
      style={{
        width: "90%",
        height: "50%",
        alignSelf: "center",
        marginTop: 10,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      <RNCalendar
        onDayPress={(day) => {
          onDateSelected(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: "#4db5ff",
            selectedTextColor: "#fff",
          },
        }}
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
