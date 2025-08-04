import { Stack } from "expo-router";
import { SelectedDateProvider } from "../data/DateContext";
import { StreakProvider } from "../data/StreakContext";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import AuthPasscodeScreen from "./main/password/AuthPasscodeScreen";
import { CardStyleInterpolators } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [requirePasscode, setRequirePasscode] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setAuthenticated(true);
  };

  useEffect(() => {
    const checkPasscode = async () => {
      const enabled = await SecureStore.getItemAsync("passcode_enabled");
      if (enabled === "true") {
        setRequirePasscode(true);
      }
      setIsChecking(false);
    };
    checkPasscode();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (requirePasscode && !authenticated) {
    return <AuthPasscodeScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SelectedDateProvider>
        <StreakProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
            }}
          />
        </StreakProvider>
      </SelectedDateProvider>
    </GestureHandlerRootView>
  );
}
