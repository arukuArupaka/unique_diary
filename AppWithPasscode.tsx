import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitialScreen from "./password/InitialScreen";
import AuthPasscodeScreen from "./password/AuthPasscodeScreen";
import SetPasscodeScreen from "./password/SetPasscodeScreen";
import HomeScreen from "./index";

const Stack = createNativeStackNavigator();

export default function AppWithPasscode() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Initial" component={InitialScreen} />
        <Stack.Screen name="AuthPasscode" component={AuthPasscodeScreen} />
        <Stack.Screen name="SetPasscode" component={SetPasscodeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
