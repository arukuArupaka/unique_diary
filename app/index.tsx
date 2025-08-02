import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          // 初回起動：ウォークスルーへ
          await AsyncStorage.setItem("hasLaunched", "true");
          router.replace("/main/screens/WalkthroughScreen");
        } else {
          // 2回目以降：日記入力画面へ
          router.replace("/main/InputPase");
        }
      } catch (error) {
        console.error("初回起動判定エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
};

export default Index;
