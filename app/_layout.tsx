import { Stack } from "expo-router";
import { SelectedDateProvider } from "../data/DateContext";
import { StreakProvider } from "../data/StreakContext";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  // パスコード関連のuseStateやuseEffectのロジックをすべて削除

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
