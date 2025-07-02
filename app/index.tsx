import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "./header";
import Footer from "./footer";
import Input from "@/components/Input";
import { useSuggestion } from "../components/Suggestion_Section";
import StreakDisplay from "../components/StreakDisplay";
import ContionuousIcon from "@/components/ContionuousIcon";

const Index = () => {
  const [diaryText, setDiaryText] = useState("");

  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();

  const [suggestionwhole, setsuggestionwhole] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Header />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Input />

          {/* 🔥 連続記録セクション */}
          <ContionuousIcon />
        </View>

        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;
