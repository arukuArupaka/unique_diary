import { TouchableOpacity, View } from "react-native";
import { useStreak } from "../data/StreakContext";
import { FontAwesome5 } from "@expo/vector-icons";
import StreakDisplay from "./StreakDisplay";

import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import Tesuto from "@/app/tesuto";
import * as Animatable from "react-native-animatable";

const ContionuousIcon = () => {
  const RankColor = (streak: number): string => {
    if (streak < 1) return "black";
    if (streak < 3) return "#FFD700";
    if (streak < 7) return "orange";
    if (streak < 14) return "red";
    if (streak < 30) return "purple";
    return "#00FFFF";
  };
  // useEffect(() => {
  //   setStreak(7); // 一時的に数字をいじれる
  // }, []);
  const { streak, setStreak } = useStreak(0);

  return (
    <View
      style={{
        width: "100%",
        height: "40%",
        marginTop: 20,
      }}
    >
      {/*🔥連続記録 */}
      {streak > 50 ? (
        <Tesuto />
      ) : (
        <TouchableOpacity
          style={{
            width: "25%",
            height: "45%",
            alignItems: "center",
            justifyContent: "flex-end", //下に行く
            marginHorizontal: "37%",
          }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }}
        >
          <FontAwesome5
            name="fire"
            size={streak < 30 ? 50 + streak * 2 : 110}
            color={RankColor(streak)}
          />
        </TouchableOpacity>
      )}

      <View
        style={{
          width: "100%",
          height: "55%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StreakDisplay />
      </View>
    </View>
  );
};
export default ContionuousIcon;
