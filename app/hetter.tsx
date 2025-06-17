import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";

const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const todayString = `${month}月${day}日`; // 今日の日付
const Hetter = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "10%",
        flexDirection: "row",
        gap: "5%",
        backgroundColor: "#f0f8ff", //#e0ffff別の候補
        paddingTop: "12%",
        borderBottomWidth: 1,
        borderColor: "#ccc",
      }}
    >
      <Text
        style={{
          color: "black",
          fontSize: 32,
          marginLeft: 15,
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        {todayString} {/* 今日の日付を表示 */}
      </Text>
      <Feather
        name="bell"
        size={31}
        color="black"
        style={{
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
          marginTop: 3,
          marginLeft: "33%",
        }}
      />
      <TouchableOpacity
        onPress={() => {
          router.push("/tesuto"); //画面移動　エラーはあっても動く
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: 35,
          height: 35,
          marginTop: 0,
          backgroundColor: "#ffffff",
          shadowColor: "black",
          //shadowOffset: { width: 0, height: 2 }, //影
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "25%",
            backgroundColor: "red",
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
      </TouchableOpacity>
    </View>
  );
};

export default Hetter;
