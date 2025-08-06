import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";

type Props = {
  onAuthenticated: () => void;
};

const AuthPasscodeScreen: React.FC<Props> = ({ onAuthenticated }) => {
  const [input, setInput] = useState("");

  const handleCheckPasscode = async () => {
    const stored = await SecureStore.getItemAsync("passcode");
    if (stored === input) {
      onAuthenticated();
    } else {
      Alert.alert("パスワードが異なります");
      setInput("");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginBottom: 20,
          color: "#333",
        }}
      >
        パスコードを入力してください
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          fontSize: 24,
          paddingVertical: 12,
          paddingHorizontal: 20,
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          marginBottom: 20,
          color: "#000",
        }}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={input}
        onChangeText={setInput}
        placeholder="●●●●"
        placeholderTextColor="#999"
      />
      <Button title="確認" onPress={handleCheckPasscode} />
    </View>
  );
};

export default AuthPasscodeScreen;
