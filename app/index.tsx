import React, { useState, useEffect } from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Header from "./header";
import Footer from "./footer";
import Input from "@/components/Input";
import { useSuggestion } from "../components/Suggestion_Section";
import ContionuousIcon from "@/components/ContionuousIcon";

const Index = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();

  const [suggestionwhole, setsuggestionwhole] = useState(false);

  useEffect(() => {
    const redirectToWalkthrough = async () => {
      await router.replace("/screens/WalkthroughScreen"); // 起動時に必ずウォークスルー画面へ遷移
    };
    redirectToWalkthrough();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ここには通常は到達しない想定（遷移中はloadingがtrueのままなので）
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Header />
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <Input />
          <ContionuousIcon />
        </View>
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;
