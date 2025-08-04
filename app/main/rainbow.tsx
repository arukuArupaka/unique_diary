import React, { useEffect } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Gyroscope } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  SensorType,
  interpolate,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";

/* ---------- 定数 ---------- */
const CARD_WIDTH = 150;
const CARD_HEIGHT = 150;
const CARD_IMAGE = {
  uri: "https://images.unsplash.com/photo-1549421254-b088a3e35594?auto=format&fit=crop&w=3087&q=80",
};
const HOLO_COLORS = [
  "rgba(255, 0, 255, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(0, 255, 255, 0.5)",
  "rgba(0, 255, 0, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(255, 0, 0, 0.5)",
] as const;

export default function Rainbow() {
  const gyro = useAnimatedSensor(SensorType.GYROSCOPE, { interval: 16 });
  const scale = useSharedValue(1);
  const shake = useSharedValue(0); // translateX に使用

  /* ===== 1. 揺れをまとめた関数 ===== */
  const playShake = () => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 300 }),
      withTiming(1.0, { duration: 300 })
    );
    shake.value = withSequence(
      withTiming(3, { duration: 100 }),
      withTiming(-3, { duration: 100 }),
      withTiming(3, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };
  useEffect(() => {
    playShake(); // 画面遷移時1回揺れる
  }, []);

  /* ===== 3. タップ時（ハプティクス + 揺れ） ===== */
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    playShake();
  };

  /* ===== 4. アニメーションスタイル ===== */
  const animatedCardStyle = useAnimatedStyle(() => {
    const { x, y } = gyro.sensor.value;
    const rotateY = interpolate(y, [-Math.PI / 2, Math.PI / 2], [-20, 20]);
    const rotateX = interpolate(x, [-Math.PI / 2, Math.PI / 2], [-20, 20]);

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
        { translateX: shake.value },
      ],
    };
  });

  const animatedGlossStyle = useAnimatedStyle(() => {
    const { x, y } = gyro.sensor.value;
    return {
      transform: [
        {
          translateX: interpolate(y, [-Math.PI / 2, Math.PI / 2], [-180, 180]),
        },
        {
          translateY: interpolate(x, [-Math.PI / 2, Math.PI / 2], [-120, 120]),
        },
        {
          rotate: `${interpolate(
            y,
            [-Math.PI / 2, Math.PI / 2],
            [-45, 45]
          )}deg`,
        },
      ],
    };
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Animated.View style={[styles.card, animatedCardStyle]}>
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View style={styles.maskCenter}>
              <FontAwesome5 name="fire" size={120} color="black" />
            </View>
          }
        >
          <Image source={CARD_IMAGE} style={styles.background} />
          <Animated.View style={[styles.gloss, animatedGlossStyle]}>
            <LinearGradient
              colors={HOLO_COLORS}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </MaskedView>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: "transparent",
    overflow: "hidden",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  maskCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  background: { width: "100%", height: "100%", position: "absolute" },
  gloss: { ...StyleSheet.absoluteFillObject, opacity: 0.7 },
});
