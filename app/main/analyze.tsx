import Header from "@/components/header";
import React, { useState, useCallback } from "react";
import { Text, View, ActivityIndicator, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";

// 取得した統計データを格納するための型を定義
type UserStats = {
  consecutive_days: number;
  max_consecutive_days: number;
  cumulative_days: number;
};

const Analyze = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [latestFeedback, setLatestFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  // 今日の日付を "YYYY-MM-DD" 形式で取得するヘルパー関数
  const getTodayString = (): string => {
    const now = new Date();
    now.setHours(now.getHours() + 9); // JSTに調整
    return now.toISOString().split("T")[0];
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("ユーザーが見つかりません");

          const today = getTodayString(); // 今日の日付を取得

          // --- 統計データの取得準備 ---
          const statsPromise = supabase
            .from("users")
            .select("consecutive_days, max_consecutive_days, cumulative_days")
            .eq("id", user.id)
            .single();

          // --- ★★★ ここを修正 ★★★ ---
          // 「今日の日付」のフィードバックを取得する準備
          const feedbackPromise = supabase
            .from("diaries")
            .select("feedback")
            .eq("user_id", user.id)
            .eq("entry_date", today) // ★「今日の日付」に限定
            .not("feedback", "is", null)
            .limit(1)
            .single();

          // --- 両方の処理を同時に実行し、完了を待つ ---
          const [statsResult, feedbackResult] = await Promise.all([
            statsPromise,
            feedbackPromise,
          ]);

          // --- 結果をStateに保存 ---
          if (statsResult.error && statsResult.status !== 406) {
            throw statsResult.error;
          }
          if (statsResult.data) {
            setStats(statsResult.data);
          }

          if (feedbackResult.data) {
            setLatestFeedback(feedbackResult.data.feedback);
          } else {
            setLatestFeedback("");
          }
        } catch (error) {
          console.error("分析データの取得エラー:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
      <Header />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* --- 統計カードエリア --- */}
        <View style={{ flexDirection: "row", marginBottom: 16, gap: 16 }}>
          {/* 現在の連続日数 */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={{ color: "#6e6e73", fontSize: 13, marginBottom: 8 }}>
              現在の連続書き込み日数
            </Text>
            {loading ? (
              <ActivityIndicator
                style={{ marginTop: 8, alignSelf: "flex-start" }}
              />
            ) : (
              <Text
                style={{
                  color: "#1d1d1f",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                {stats?.consecutive_days ?? 0}日
              </Text>
            )}
          </View>

          {/* 最高連続日数 */}
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text style={{ color: "#6e6e73", fontSize: 13, marginBottom: 8 }}>
              最高連続書き込み日数
            </Text>
            {loading ? (
              <ActivityIndicator
                style={{ marginTop: 8, alignSelf: "flex-start" }}
              />
            ) : (
              <Text
                style={{
                  color: "#1d1d1f",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                {stats?.max_consecutive_days ?? 0}日
              </Text>
            )}
          </View>
        </View>

        {/* 累計日数 */}
        <View
          style={{
            flex: 0.22,
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
            marginBottom: 24,
          }}
        >
          <Text style={{ color: "#6e6e73", fontSize: 13, marginBottom: 8 }}>
            累計書き込み日数
          </Text>
          {loading ? (
            <ActivityIndicator
              style={{ marginTop: 8, alignSelf: "flex-start" }}
            />
          ) : (
            <Text
              style={{
                color: "#1d1d1f",
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {stats?.cumulative_days ?? 0}日
            </Text>
          )}
        </View>

        {/* --- AIからのメッセージエリア --- */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 12,
            color: "#1d1d1f",
          }}
        >
          AIからのメッセージ
        </Text>
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 16,
            minHeight: 150,
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ fontSize: 16, color: "#333", lineHeight: 24 }}>
              {latestFeedback ||
                "今日のAIからのフィードバックはまだありません。今日の日記を書いてみましょう！"}
            </Text>
          )}
        </View>
        <Text
          style={{
            fontSize: 12,
            color: "#6e6e73",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          *今日の日記に対するフィードバックが表示されます。
        </Text>
      </View>
    </View>
  );
};

export default Analyze;
