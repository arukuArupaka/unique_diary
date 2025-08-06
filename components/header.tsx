import Feather from "@expo/vector-icons/Feather";
import { router, usePathname } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import * as Haptics from "expo-haptics";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";

const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const todayString = `${month}月${day}日`;
const Header = () => {
  const [fontsLoaded] = useFonts({
    "Lato-Regular": require("../assets/fonts/Lato/Lato-Regular.ttf"),
    "Lato-Bold": require("../assets/fonts/Lato/Lato-Bold.ttf"),
  });

  const pathname = usePathname(); // 今どこの画面にいるか見れる。
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
        paddingTop: "12%",
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      {pathname === "/main/set-passcode" ||
      pathname === "/main/analyze" ||
      pathname === "/main/faq" ? (
        <TouchableOpacity
          style={{ marginLeft: 3 }}
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
          {todayString}
        </Text>
      )}
    </LinearGradient>
  );
};

export default Header;
