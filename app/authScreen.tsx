import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // アイコン表示のため
import { supabase } from "../lib/supabase"; // あなたのSupabaseクライアントのパス

// コンポーネント名をLoginScreenからAuthScreenに変更
const AuthScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // --- ログイン処理 ---
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert(
        "入力エラー",
        "メールアドレスとパスワードを入力してください。"
      );
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert("ログインエラー", "アカウントがないよ");
    setLoading(false);
    // 成功すればonAuthStateChangeが検知し自動で画面遷移
  };

  // --- ★新規登録処理を追加 ---
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("入力エラー", "メールアドレスとパスワードを入力してね");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert("登録エラー", error.message);
    } else {
      // Supabaseのデフォルトでは確認メールが飛びます
      Alert.alert(
        "登録ありがとうございます！",
        "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。"
      );
    }
    setLoading(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View
            style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24 }}
          >
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#4db5ff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="edit" size={40} color="white" />
              </View>
            </View>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              stepinへようこそ!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "gray",
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              メールアドレスでログインまたは登録
            </Text>

            {/* --- 入力フォーム (変更なし) --- */}
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              メールアドレス
            </Text>
            <TextInput
              style={{
                height: 50,
                borderColor: "#ddd",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 16,
                marginBottom: 20,
                backgroundColor: "#f9f9f9",
              }}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Text style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
              パスワード
            </Text>
            <TextInput
              style={{
                height: 50,
                borderColor: "#ddd",
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 16,
                marginBottom: 20,
                backgroundColor: "#f9f9f9",
              }}
              placeholder="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* --- ボタンエリア --- */}
            {/* ログインボタン */}
            <TouchableOpacity
              onPress={handleSignIn}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#a9c8e8" : "#4db5ff",
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 16,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  ログイン
                </Text>
              )}
            </TouchableOpacity>

            {/* ★新規登録ボタンを追加 */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              style={{
                backgroundColor: "white", // ログインボタンと区別するため背景色を変更
                borderColor: "#4db5ff", // 枠線の色
                borderWidth: 1,
                paddingVertical: 16,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 12, // ボタン間の余白
              }}
            >
              {loading ? (
                <ActivityIndicator color="#4db5ff" />
              ) : (
                <Text
                  style={{ color: "#4db5ff", fontSize: 16, fontWeight: "bold" }}
                >
                  新規登録
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AuthScreen;
