import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "@/components/header";

const SetPasscodeScreen: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  // step: 1 = 初回入力, 2 = 再確認
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");

  /** 1 回目 4 桁入力を検証 */
  const handleNext = () => {
    if (pin.length !== 4) {
      Alert.alert("エラー", "パスコードは4桁で入力してください");
      return;
    }
    setStep(2);
  };

  /** 再確認して保存 */
  const handleConfirm = async () => {
    if (pin === confirmPin) {
      await SecureStore.setItemAsync("passcode", pin);
      await SecureStore.setItemAsync("passcode_enabled", "true");
      Alert.alert("設定完了", "パスコードが設定されました");
      router.back(); // 前の画面へ戻る（index.tsx など）
    } else {
      Alert.alert(
        "パスコードの不一致",
        "もう一度パスコードを設定しなおしてください"
      );
      setConfirmPin("");
      setStep(1);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
        <Header />
        <View
          style={{
            flex: 1,
            backgroundColor: "",
            paddingTop: 90,
            paddingHorizontal: 20,
            justifyContent: "flex-start",
          }}
        >
          {/* タイトル */}
          <Text
            style={{
              fontSize: 30,
              textAlign: "center",
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {step === 1
              ? "4桁のパスコードを\n入力してください"
              : "もう一度パスコードを\n入力してください"}
          </Text>

          <Text
            style={{
              fontSize: 14,
              textAlign: "center",
              color: "gray",
              marginBottom: 20,
            }}
          >
            パスコードを忘れると復元ができません。{"\n"}大切に保管してください。
          </Text>

          {/* 入力フィールド */}
          <TextInput
            style={{
              borderBottomWidth: 1,
              fontSize: 24,
              textAlign: "center",
              marginBottom: 20,
              paddingVertical: 6,
            }}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={4}
            value={step === 1 ? pin : confirmPin}
            onChangeText={step === 1 ? setPin : setConfirmPin} //1回目と再確認を区別
          />

          {/* 次へ / 決定 ボタン */}
          <TouchableOpacity
            style={{
              alignSelf: "center",
              backgroundColor: "#4db5ff",
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 8,
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
            onPress={step === 1 ? handleNext : handleConfirm}
          >
            <Text style={{ color: "#fff", fontSize: 25 }}>
              {step === 1 ? "次へ" : "決定"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SetPasscodeScreen;
