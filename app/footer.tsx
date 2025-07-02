import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const todayString = `${month}月${day}日`; // 今日の日付
const Footer = () => {
  const pathname = usePathname(); //今どこの画面にいるか見れる。
  const activeColor = "#4db5ff"; //水色っぽいつ
  const inactiveColor = "#808080"; //グレー

  {
    /* フッター部分 */
  }
  return (
    <LinearGradient
      colors={["#d2ecff", "#f0f8ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: "100%",
        height: "10%",
        backgroundColor: "#f0f8ff",
        paddingTop: "1.5%",
        justifyContent: "center",
        borderTopWidth: 0,
        borderColor: "#ccc",
        flexDirection: "row",
        gap: "20%",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          router.push("/second"); //画面移動　エラーはあっても動く
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: "12%",
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
              backgroundColor:
                pathname === "/second" ? activeColor : inactiveColor,
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
        onPress={() => {
          router.push("/");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: "12%",
          height: "60%",
          borderRadius: 10,
          // backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <MaterialCommunityIcons
          name="home-edit-outline"
          size={46}
          color={pathname === "/" ? activeColor : inactiveColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/detail");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
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
        <Entypo
          name="list"
          size={46}
          color={pathname === "/detail" ? activeColor : inactiveColor} // その画面にいるときは水色
        />
        {/* その画面にいるときは#4db5ffこの色にしたい*/}
      </TouchableOpacity>
    </LinearGradient>
  );
};
export default Footer;
