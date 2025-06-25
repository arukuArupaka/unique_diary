import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Gyroscope } from "expo-sensors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useAnimatedSensor,
  SensorType,
  interpolate,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5 } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";

// カードの背景画像
const CARD_IMAGE = {
  uri: "https://images.unsplash.com/photo-1549421254-b088a3e35594?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3087&q=80",
};
const CARD_WIDTH = 400; //ここでカードの幅いじれる
const CARD_HEIGHT = 150; //ここでカードの高さをいじれる

// ホログラム風のカラフルなグラデーション色
const HOLO_COLORS = [
  "rgba(255, 0, 255, 0.5)", // マゼンタ
  "rgba(0, 0, 255, 0.5)", // ブルー
  "rgba(0, 255, 255, 0.5)", // シアン
  "rgba(0, 255, 0, 0.5)", // グリーン
  "rgba(255, 255, 0, 0.5)", // イエロー
  "rgba(255, 0, 0, 0.5)", // レッド
] as const;

export default function Rainbow() {
  const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
    interval: 16,
  });

  // カード全体の傾きアニメーション
  const animatedCardStyle = useAnimatedStyle(() => {
    const { x, y } = animatedSensor.sensor.value;
    const rotateY = withTiming(
      interpolate(y, [-Math.PI / 2, Math.PI / 2], [-20, 20]),
      { duration: 100 }
    );
    const rotateX = withTiming(
      interpolate(x, [-Math.PI / 2, Math.PI / 2], [-20, 20]),
      { duration: 100 }
    );
    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
      ],
    };
  });

  // 光沢の移動アニメーション
  const animatedGlossStyle = useAnimatedStyle(() => {
    const { x, y } = animatedSensor.sensor.value;
    const translateX = withTiming(
      interpolate(y, [-Math.PI / 2, Math.PI / 2], [-180, 180]),
      { duration: 100 }
    );
    const translateY = withTiming(
      interpolate(x, [-Math.PI / 2, Math.PI / 2], [-120, 120]),
      { duration: 100 }
    );
    const rotate = interpolate(y, [-Math.PI / 2, Math.PI / 2], [-45, 45]);
    return {
      transform: [{ translateX }, { translateY }, { rotate: `${rotate}deg` }],
    };
  });

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        backgroundColor: "#111",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }}
    >
      <Animated.View
        style={[
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 20,
            // カードの背景を白にする
            backgroundColor: "#f8f8ff",
            // 影
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 20,
            elevation: 20,
          },
          animatedCardStyle,
        ]}
      >
        <MaskedView
          style={StyleSheet.absoluteFill}
          // マスクの形としてアイコンを指定
          maskElement={
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="fire" size={120} color="black" />
            </View>
          }
        >
          {/* マスクの形で表示される中身（ホログラム効果） */}
          <Image
            source={CARD_IMAGE}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
          />
          <Animated.View
            style={[
              {
                ...StyleSheet.absoluteFillObject,
                opacity: 0.7,
              },
              animatedGlossStyle,
            ]}
          >
            <LinearGradient
              colors={HOLO_COLORS}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                flex: 1,
              }}
            />
          </Animated.View>
        </MaskedView>
      </Animated.View>
    </TouchableOpacity>
  );
}
