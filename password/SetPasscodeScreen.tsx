import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

const SetPasscodeScreen = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1); // 1: 初回入力, 2: 再確認
  const navigation = useNavigation();

  const handleNext = () => {
    if (pin.length !== 4) {
      Alert.alert("4桁のパスコードを入力してください");
      return;
    }
    setStep(2);
  };

  const handleConfirm = async () => {
    if (pin === confirmPin) {
      await SecureStore.setItemAsync("passcode", pin);
      await SecureStore.setItemAsync("passcode_enabled", "true");
      Alert.alert("パスコードが設定されました");
      navigation.goBack(); // detail.tsx に戻る
    } else {
      Alert.alert("パスコードが一致しません");
      setConfirmPin("");
      setStep(1); // 最初からやり直し
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {step === 1
          ? "4桁のパスコードを入力してください"
          : "もう一度パスコードを入力してください"}
      </Text>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        value={step === 1 ? pin : confirmPin}
        onChangeText={step === 1 ? setPin : setConfirmPin}
      />
      <Button
        title={step === 1 ? "次へ" : "決定"}
        onPress={step === 1 ? handleNext : handleConfirm}
      />
    </View>
  );
};

export default SetPasscodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderBottomWidth: 1,
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});
