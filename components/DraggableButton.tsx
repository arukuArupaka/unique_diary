import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  TouchableOpacity,
  Text,
  View,
} from "react-native";

const DraggableButton = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        borderRadius: 10,
        backgroundColor: "red",
      }}
    >
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          pan.getLayout(),
          { position: "absolute", top: 100, left: 100 }, // 初期位置
        ]}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#4682b4",
            padding: 15,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            ドラッグしてね
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DraggableButton;
