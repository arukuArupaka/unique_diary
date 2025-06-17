import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { useStreak } from "@/data/StreakContext";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const todayIndex = new Date().getDay();

const StreakDisplay = forwardRef((props, ref) => {
  const { streak, setStreak } = useStreak(0);
  const [checkedWeekdays, setCheckedWeekdays] = useState<number[]>([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnimations = useRef<Animated.Value[]>([]);

  if (checkAnimations.current.length === 0) {
    for (let i = 0; i < 7; i++) {
      checkAnimations.current[i] = new Animated.Value(1);
    }
  }

  const startStreakAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 2.0,
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

  const triggerCheckAnim = (index: number) => {
    checkAnimations.current[index].setValue(0);
    Animated.spring(checkAnimations.current[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 100,
    }).start();
  };

  const loadStreakAndWeekdays = async () => {
    try {
      const today = getTodayString();
      const storedStreak = await AsyncStorage.getItem("streakCount");
      const streakNum = storedStreak ? parseInt(storedStreak, 10) : 0;
      setStreak(streakNum);

      const animatedDate = await AsyncStorage.getItem("streakAnimationDate");
      if (animatedDate !== today) {
        startStreakAnimation();
        await AsyncStorage.setItem("streakAnimationDate", today);
      }

      const storedLogDates = await AsyncStorage.getItem("logDates");
      if (!storedLogDates) return;

      const dateArray: string[] = JSON.parse(storedLogDates);
      const validDates = dateArray
        .filter(isValidDateString)
        .filter((d) => d <= today);

      const now = new Date();
      now.setHours(now.getHours() + 9);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const weekdayIndexes = validDates
        .map((dateStr) => {
          const d = new Date(dateStr);
          d.setHours(d.getHours() + 9);
          if (d >= startOfWeek && d <= endOfWeek) {
            return d.getDay();
          }
          return null;
        })
        .filter((d): d is number => d !== null);

      setCheckedWeekdays([...new Set(weekdayIndexes)]);

      if (weekdayIndexes.includes(todayIndex)) {
        triggerCheckAnim(todayIndex);
      }
    } catch (err) {
      console.error("ストリーク読み込みエラー:", err);
    }
  };

  useEffect(() => {
    loadStreakAndWeekdays();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: async () => {
      await loadStreakAndWeekdays();
    },
  }));

  return (
    <View
      style={{
        alignItems: "center",
        marginTop: -8,
        paddingHorizontal: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "baseline",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Animated.Text
          style={[
            {
              fontSize: 40,
              fontWeight: "bold",
              color: "#FF6B35",
              marginRight: 6,
            },
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {streak}
        </Animated.Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            color: "#000000",
          }}
        >
          日連続記録
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "95%",
        }}
      >
        {days.map((day, index) => {
          const isChecked = checkedWeekdays.includes(index);
          const isToday = index === todayIndex;
          return (
            <View
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "95%",
              }}
            >
              <Text
                style={[
                  {
                    fontSize: 14,
                    color: "#444",
                    marginBottom: 4,
                  },
                  isToday && {
                    fontWeight: "700",
                    color: "#3B3B3B",
                  },
                ]}
              >
                {day}
              </Text>
              <View
                style={[
                  {
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
                  isChecked
                    ? {
                        backgroundColor: "#FF7F50",
                      }
                    : {
                        backgroundColor: "#FFDAB9",
                      },
                ]}
              >
                {isChecked && (
                  <Animated.View
                    style={{
                      transform: [{ scale: checkAnimations.current[index] }],
                    }}
                  >
                    <Entypo name="check" size={16} color="#fff" />
                  </Animated.View>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
});

export default StreakDisplay;
