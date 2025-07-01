import Feather from "@expo/vector-icons/Feather";
import { router, usePathname } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const todayString = `${month}月${day}日`; // 今日の日付
const Header = () => {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../assets/fonts/Lato/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato/Lato-Bold.ttf"),
  });

  const pathname = usePathname(); // 今どこの画面にいるか見れる。
  //console.log("現在のパス:", pathname);
  return (
    <LinearGradient
      colors={["#d2ecff", "#f0f8ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: "100%",
        height: "10%",
        flexDirection: "row",
        gap: "5%",
        // backgroundColor: "#f0f8ff", //#e0ffff別の候補 #bfe4ff
        paddingTop: "12%",
        // borderBottomWidth: 3,
        // borderColor: "#ccc",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {pathname === "/set-passcode" ? ( //戻るボタンが必要な時に戻るボタンに変化する。
        <TouchableOpacity
          style={{
            marginLeft: 3,
          }}
          onPress={() => {
            router.back();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
      ) : (
        <Text
          style={{
            fontFamily: "Lato-Regular",
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
      )}
      {/* <Feather
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
        router.push("/"); //画面移動　エラーはあっても動く
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
          {day} {/* 今日の日の「日」の部分を表示
        </Text>
      </View>
    </TouchableOpacity> */}
    </LinearGradient>
  );
};

export default Header;
