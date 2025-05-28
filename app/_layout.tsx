import { Stack } from "expo-router";
import { SelectedDateProvider } from "../data/DateContext";

export default function RootLayout() {
  return (
    <SelectedDateProvider // いろんな場所で共有するため
    >
      <Stack screenOptions={{ headerShown: false }} />
    </SelectedDateProvider>
  );
}
