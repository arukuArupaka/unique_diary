import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Header from "@/components/header";

const faqs = [
  {
    q: "stepinはどんなアプリ？",
    a: "習慣化をしやすいように設計された日記アプリです。",
  },
  {
    q: "リマインダーの仕様が分かりません。",
    a: "リマインダーボタンを押した時点で直前の１０日間の記録をもとに、あなたが普段日記を書くおおよその時間を算出し、通知をします。",
  },
  {
    q: "連続記録(🔥)はどう増えますか？",
    a: "その日の記録を保存するとカウントが増え、連続日数に応じて炎の見た目が変化します。日記を書くことが出来なかった日があると、記録がリセットされます。",
  },
  {
    q: "🔥マークはどこまで成長しますか？",
    a: "習慣化の目安といわれる「２週間」を、🔥の成長の限界にしています。",
  },
];

export default function FAQ() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8ff" }}>
      {/* ヘッダーはパスコード設定画面と同じものを使用（Footerは不要） */}
      <Header />
      {/* ヘッダー以外はすべて文字 */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>よくある質問</Text>
        {faqs.map((item, i) => (
          <View key={i} style={styles.block}>
            <Text style={styles.q}>Q. {item.q}</Text>
            <Text style={styles.a}>{item.a}</Text>
          </View>
        ))}
        <Text style={styles.note}>
          ※ 内容は今後のアップデートで変更される場合があります。
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: "600", color: "#222", marginBottom: 12 },
  block: { marginTop: 16 },
  q: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 6 },
  a: { fontSize: 15, lineHeight: 22, color: "#444" },
  note: { marginTop: 24, fontSize: 12, color: "#777" },
});
