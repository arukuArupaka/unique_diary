import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { TouchableOpacity, View, Text } from "react-native";
import * as Haptics from "expo-haptics";
import { usePathname } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSelectedDate } from "@/data/DateContext";

const Footer = () => {
  const pathname = usePathname();
  const activeColor = "#4db5ff";
  const inactiveColor = "#808080";

  const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const { setSelectedDate } = useSelectedDate(); // ✅ useSelectedDate フックをコンポーネントの中で呼び出す

  return (
    <LinearGradient
      colors={["#d2ecff", "#f0f8ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: "100%",
        height: "10%",
        paddingTop: "1.5%",
        justifyContent: "center",
        flexDirection: "row",
        gap: "20%",
      }}
    >
      {/* 日付ボタン */}
      <TouchableOpacity
        onPress={() => {
          router.push("/second");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: "12%",
          height: "60%",
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 35,
            height: 35,
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
            }}
          />
          <View
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: 13,
            }}
          >
            <Text style={{ fontSize: 22, textAlign: "center" }}>{day}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ホームボタン */}
      <TouchableOpacity
        onPress={() => {
          setSelectedDate(formatDate(new Date())); // ✅ 今日をセット
          router.push("/InputPase");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: "12%",
          height: "60%",
          borderRadius: 10,
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
          color={pathname === "/InputPase" ? activeColor : inactiveColor}
        />
      </TouchableOpacity>

      {/* リストボタン */}
      <TouchableOpacity
        onPress={() => {
          router.push("/detail");
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        style={{
          width: "12%",
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
          color={pathname === "/detail" ? activeColor : inactiveColor}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default Footer;
