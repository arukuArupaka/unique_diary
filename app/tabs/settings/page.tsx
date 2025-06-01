// app/tabs/settings/page.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("handwriting"); // 今どの設定を見てるか

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      {/* タブ選択部分 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "handwriting" && styles.activeTab]}
          onPress={() => setActiveTab("handwriting")}
        >
          <Text>手書き入力</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "voice" && styles.activeTab]}
          onPress={() => setActiveTab("voice")}
        >
          <Text>音声入力</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "passcode" && styles.activeTab]}
          onPress={() => setActiveTab("passcode")}
        >
          <Text>パスコード</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "theme" && styles.activeTab]}
          onPress={() => setActiveTab("theme")}
        >
          <Text>テーマ</Text>
        </TouchableOpacity>
      </View>

      {/* コンテンツ部分 */}
      <ScrollView style={{ flex: 1, padding: 20 }}>
        {activeTab === "handwriting" && (
          <View>
            <Text style={styles.title}>手書き入力の設定</Text>
            <Text>ここに手書き入力の設定UIを追加してください</Text>
          </View>
        )}
        {activeTab === "voice" && (
          <View>
            <Text style={styles.title}>音声入力の設定</Text>
            <Text>ここに音声入力の設定UIを追加してください</Text>
          </View>
        )}
        {activeTab === "passcode" && (
          <View>
            <Text style={styles.title}>パスコードの設定</Text>
            <Text>ここにパスコード設定UIを追加してください</Text>
          </View>
        )}
        {activeTab === "theme" && (
          <View>
            <Text style={styles.title}>テーマの設定</Text>
            <Text>ここにテーマ設定UIを追加してください</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#eee",
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

