import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SuggestionSection from "../components/SuggestionSection";

export default function Index() {
  const [diaryText, setDiaryText] = useState(""); // 日記の入力内容を保持する状態

  const handleSave = () => {
    if (diaryText.trim() === "") {
      Alert.alert("エラー", "日記の内容を入力してください");
      return;
    }

    // 保存した後の処理（ここではアラート）
    Alert.alert("保存完了", "日記が保存されました");
    setDiaryText(""); // 入力欄をクリア
  };

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayString = `${month}月${day}日`; // 今日の日付

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
        }}
      >
        {/* ヘッダー部分 */}
        <View
          style={{
            width: "100%",
            height: "10%",
            flexDirection: "row",
            gap: "5%",
            backgroundColor: "#f0f8ff", //#e0ffff別の候補
            paddingTop: "12%",
            borderBottomWidth: 1,
            borderColor: "#ccc",
          }}
        >
          <Text
            style={{
              color: "black",
              fontSize: 32,
              marginLeft: 15,
            }}
          >
            {todayString} {/* 今日の日付を表示 */}
          </Text>
          <Feather
            name="bell"
            size={31}
            color="black"
            style={{
              marginTop: 3,
              marginLeft: "33%",
            }}
          />
          <View
            style={{
              width: 35,
              height: 35,
              marginTop: 0,
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                width: "100%",
                height: "25%",
                backgroundColor: "red",
                zIndex: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 13,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  marginBottom: 0,
                  backgroundColor: "",
                  textAlign: "center",
                }}
              >
                {day} {/* 今日の日の「日」の部分を表示 */}
              </Text>
            </View>
          </View>
        </View>

        {/* 日記入力エリア */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              marginBottom: 10,
            }}
          >
            今日の日記
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 12,
              height: 150,
              textAlignVertical: "top",
              backgroundColor: "#fff",
              marginBottom: 20,
              fontSize: 20,
            }}
            placeholder="今日はどんな一日だった？"
            multiline
            value={diaryText}
            onChangeText={setDiaryText} // 入力内容が変わるたびに状態を更新
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
                width: "35%",
              }}
              onPress={handleSave}
            >
              <Text
                style={{
                  fontSize: 30,
                }}
              >
                保存する
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/*メモ提案機能仮 */}
        <View style={{ flex: 1 }}>
          {/* 既存の入力エリアの下に追加するのが良い */}
          <SuggestionSection />
        </View>
        {/* フッター部分 */}
        <View
          style={{
            width: "100%",
            height: "10%",
            backgroundColor: "#f0f8ff",
            paddingTop: "1.5%",
            justifyContent: "center",
            borderTopWidth: 1,
            borderColor: "#ccc",
            flexDirection: "row",
            gap: "20%",
          }}
        >
          <TouchableOpacity
            style={{
              width: "12%", // 適当な横幅に変更
              height: "60%",
              borderRadius: 10,
              // backgroundColor: "#ccc",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 35,
                height: 35,
                marginTop: 0,
                backgroundColor: "white",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "25%",
                  backgroundColor: "black", //#4db5ff
                  zIndex: 10,
                }}
              ></View>
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingBottom: 13,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    marginBottom: 0,
                    backgroundColor: "",
                    textAlign: "center",
                  }}
                >
                  {day} {/* 今日の日の「日」の部分を表示 */}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "12%", // 適当な横幅に変更
              height: "60%",
              borderRadius: 10,
              // backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center", // 空文字は避ける
            }}
          >
            <MaterialCommunityIcons
              name="home-edit-outline"
              size={46}
              color="#4db5ff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: "12%", // 適当な横幅に変更
              height: "60%",
              borderRadius: 10,
              //backgroundColor: "white", // 空文字は避ける
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Entypo name="list" size={46} color="black" />{" "}
            {/* その画面にいるときは#4db5ffこの色にしたい*/}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
