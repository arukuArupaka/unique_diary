import { Animated, TouchableOpacity, View } from "react-native";
import { useStreak } from "../data/StreakContext";
import { FontAwesome5 } from "@expo/vector-icons";
import StreakDisplay from "./StreakDisplay";

import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import Rainbow from "@/app/rainbow";
import * as Animatable from "react-native-animatable";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const ContionuousIcon = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const getGradientColors = (streak: number): [string, string] => {
    if (streak < 1) return ["#666", "#333"]; // 黒
    if (streak < 3) return ["#FFD700", "#FFA500"]; // 黄色
    if (streak < 7) return ["orange", "#FF4500"]; // オレンジ
    if (streak < 14) return ["red", "#b30000"]; // 赤
    if (streak < 30) return ["purple", "#8A2BE2"]; // 紫
    return ["#00FFFF", "#00BFFF"]; // 青
  };
  // useEffect(() => {
  //   setStreak(51); // 一時的に数字をいじれる
  // }, []);
  const { streak, setStreak } = useStreak(0);

  const iconSize = streak < 30 ? 50 + streak * 2 : 110;

  const ContionuousIconAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
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

  const shakeAnimation = Animated.sequence([
    Animated.timing(translateXAnim, {
      toValue: 3,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(translateXAnim, {
      toValue: -3,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(translateXAnim, {
      toValue: 3,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(translateXAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);

  useEffect(() => {
    ContionuousIconAnimation();
    shakeAnimation.start();
  }, [streak]);

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
        <Rainbow />
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
            ContionuousIconAnimation();
            shakeAnimation.start();
          }}
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }, { translateX: translateXAnim }],
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
          </Animated.View>
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
