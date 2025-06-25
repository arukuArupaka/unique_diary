import { TouchableOpacity, View } from "react-native";
import { useStreak } from "../data/StreakContext";
import { FontAwesome5 } from "@expo/vector-icons";
import StreakDisplay from "./StreakDisplay";

import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import Tesuto from "@/app/tesuto";
import * as Animatable from "react-native-animatable";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const ContionuousIcon = () => {
  const getGradientColors = (streak: number): [string, string] => {
    if (streak < 1) return ["#666", "#333"]; // 黒
    if (streak < 3) return ["#FFD700", "#FFA500"]; // 黄色
    if (streak < 7) return ["orange", "#FF4500"]; // オレンジ
    if (streak < 14) return ["red", "#b30000"]; // 赤
    if (streak < 30) return ["purple", "#8A2BE2"]; // 紫
    return ["#00FFFF", "#00BFFF"]; // 青
  };
  // useEffect(() => {
  //   setStreak(52); // 一時的に数字をいじれる
  // }, []);
  const { streak, setStreak } = useStreak(0);

  const iconSize = streak < 30 ? 50 + streak * 2 : 110;

  function RankColor(streak: number) {
    throw new Error("Function not implemented.");
  }

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
          <MaskedView
            style={{ width: iconSize, height: iconSize }}
            maskElement={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome5 name="fire" size={iconSize} color="" />
              </View>
            }
          >
            <LinearGradient
              colors={getGradientColors(streak)}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </MaskedView>
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
