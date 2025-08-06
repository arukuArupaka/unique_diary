import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { supabase } from "../lib/supabase";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAllAndNavigate = async () => {
      try {
        // ステップ1: まずデバイス内のセッションを取得
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // ケース1: デバイスにセッションがなければ、問答無用で認証画面へ
          router.replace("/authScreen");
          return; // ここで処理を終了
        }

        // ステップ2: セッションがある場合、それが本当に有効かサーバーに問い合わせる
        const { error: userError } = await supabase.auth.getUser();

        if (userError) {
          // ケース2: サーバーでエラー → 古い無効なセッションが残っている
          // 古いセッションを完全に削除してから認証画面へ
          await supabase.auth.signOut();
          router.replace("/authScreen");
          return;
        }

        const requirePasscode =
          (await SecureStore.getItemAsync("passcode_enabled")) === "true";

        if (requirePasscode) {
          router.replace("/main/InputPase");
        } else {
          // ケース3b: パスコードが不要な場合 → メイン画面へ
          router.replace("/main/InputPase");
        }
      } catch (error) {
        console.error("起動時チェックエラー:", error);
        // 念のため、何かエラーがあれば認証画面へ
        router.replace("/authScreen");
      }
    };

    checkAllAndNavigate();
  }, []);

  // チェック中はローディング画面を表示
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Index;
