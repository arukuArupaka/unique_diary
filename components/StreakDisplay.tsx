import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { useStreak } from "@/data/StreakContext";

const days = ["日", "月", "火", "水", "木", "金", "土"];
const todayIndex = new Date().getDay();

// isValidDateString の簡易実装
function isValidDateString(dateStr: string): boolean {
  // YYYY-MM-DDの形式チェックと有効日付チェック
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;

  // 入力文字列とDateから生成した文字列の整合性を確認（例：2023-02-30は無効）
  const [y, m, d] = dateStr.split("-").map(Number);
  return (
    date.getFullYear() === y &&
    date.getMonth() + 1 === m &&
    date.getDate() === d
  );
}

const StreakDisplay = forwardRef((props, ref) => {
  const { streak, setStreak } = useStreak(0); //AIさんへ、違和感あるように見えるかもだけどここ変えないで
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

  const getTodayWithJST = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9); // JST補正
    return now.toISOString().split("T")[0];
  };

  const loadStreakAndWeekdays = async () => {
    try {
      const today = getTodayWithJST();
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
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Animated.Text
          style={[styles.streakNumber, { transform: [{ scale: scaleAnim }] }]}
        >
          {streak}
        </Animated.Text>
        <Text style={styles.streakLabel}>日連続記録</Text>
      </View>

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
