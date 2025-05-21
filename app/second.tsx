import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const second = () => {
  const router = useRouter();
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayString = `${month}月${day}日`; // 今日の日付
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}
      >
        <View>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={{
              backgroundColor: "blue",
              marginTop: 100,
              borderRadius: 5,
              width: 200,
              height: 50,
            }}
          ></TouchableOpacity>

          {/* フッター部分 */}
          <View
            style={{
              width: "100%",
              height: "10%",
              backgroundColor: "#f0f8ff",
              paddingTop: "1.5%",
              justifyContent: "center",
              borderTopWidth: 1,
              borderColor: "#ccc",
              flexDirection: "row",
              gap: "20%",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.push("second");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
              style={{
                width: "12%", // 適当な横幅に変更
                height: "60%",
                borderRadius: 10,
                // backgroundColor: "#ccc",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  marginTop: 0,
                  backgroundColor: "white",
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "25%",
                    backgroundColor: "black", //#4db5ff
                    zIndex: 10,
                  }}
                ></View>
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: 13,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 22,
                      marginBottom: 0,
                      backgroundColor: "",
                      textAlign: "center",
                    }}
                  >
                    {day} {/* 今日の日の「日」の部分を表示 */}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }
              style={{
                width: "12%", // 適当な横幅に変更
                height: "60%",
                borderRadius: 10,
                // backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center", // 空文字は避ける
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <MaterialCommunityIcons
                name="home-edit-outline"
                size={46}
                color="#4db5ff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }
              style={{
                width: "12%", // 適当な横幅に変更
                height: "60%",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Entypo name="list" size={46} color="black" />{" "}
              {/* その画面にいるときは#4db5ffこの色にしたい*/}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default second;
