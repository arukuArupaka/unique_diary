import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
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
import { useSuggestion } from "../components/Suggestion_Section";
const Index = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [diaryText, setDiaryText] = useState(""); // 日記の入力内容を保持する状態
  const { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap } =
    useSuggestion();
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

  const [suggestionwhole, setsuggestionwhole] = useState(false);
  const handlePress = () => {
    setsuggestionwhole((prev) => !prev); // 押すたびに状態を反転
  };

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
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            {todayString} {/* 今日の日付を表示 */}
          </Text>
          <Feather
            name="bell"
            size={31}
            color="black"
            style={{
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
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
              shadowColor: "black",
              //shadowOffset: { width: 0, height: 2 }, //影
              shadowOpacity: 0.5,
              shadowRadius: 4,
              elevation: 3,
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

        {/* メイン画面*/}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            backgroundColor: "",
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
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
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
              borderColor: "#ccc",
              borderWidth: 0,
            }}
          ></View>
          {/*　提案機能のボタン */}

          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "25%",
            }}
          >
            <View
              style={{
                width: "87%",
                height: "100%",
                backgroundColor: "",
              }}
            >
              {/*提案機能の文章自体*/}
              {suggestionwhole && (
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#FFFFFF",
                    borderColor: "#ccc",
                    borderWidth: 0,
                    borderRadius: 8,
                    gap: 6,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 3,
                    paddingHorizontal: "3%",
                  }}
                >
                  {/*　
                  
                  
                  お願いしますｍ（_ _）ｍ
                
                  ここ変えて↓ 
                  
                  
                  */}
                  {/*ランダムで変わる部分です。*/}
                  <Text style={{ fontSize: 15, color: "red" }}>日々</Text>
                  {/*↑これ消してもいい。色は仮見やすくしたいから */}

                  <Text style={{ fontSize: 18 }}>{DailySuggestion}</Text>

                  <Text style={{ fontSize: 15, color: "red" }}>大学生活</Text>
                  {/*↑これ消してもいい */}

                  <Text style={{ fontSize: 18 }}>{LifeSuggestion}</Text>

                  <Text style={{ fontSize: 15, color: "red" }}>人生</Text>
                  {/*↑これ消してもいい */}

                  <Text style={{ fontSize: 18 }}> {CollegeSuggestion}</Text>
                </View>
              )}
            </View>
            {/*ボタン自体*/}
            <View
              style={{
                width: "15%",
                height: "100%",
                gap: "10%",
                borderColor: "#ccc",
                borderWidth: 0,
                marginTop: "10%",
                backgroundColor: "",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handleSwap();
                }}
                style={{
                  width: "100%",
                  height: "40%",
                  backgroundColor: "",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View>
                  <MaterialCommunityIcons
                    name="restart"
                    size={60}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  handlePress();
                }}
                style={{
                  width: "100%",
                  height: "40%",
                  backgroundColor: "",
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <AntDesign name="questioncircleo" size={50} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/*連続記録*/}
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }}
            style={{
              width: "100%",
              height: "40%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "",
            }}
          >
            <FontAwesome5 name="fire" size={100} color="red" />
          </TouchableOpacity>
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
            onPress={() => {
              router.push("second");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
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
                shadowOpacity: 0.5,
                shadowRadius: 4,
                elevation: 3,
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
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
            style={{
              width: "12%", // 適当な横幅に変更
              height: "60%",
              borderRadius: 10,
              // backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center", // 空文字は避ける
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <MaterialCommunityIcons
              name="home-edit-outline"
              size={46}
              color="#4db5ff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            }
            style={{
              width: "12%", // 適当な横幅に変更
              height: "60%",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Entypo name="list" size={46} color="black" />{" "}
            {/* その画面にいるときは#4db5ffこの色にしたい*/}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Index;

Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // 軽くトンッ（デフォルト）
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // もう少しだけ強く（おすすめ）
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // しっかり重めにブルッ

//npx expo install expo-haptics(音に関する)
