import Input from "@/components/Input";
import { TouchableWithoutFeedback, View, Keyboard } from "react-native";
import Hetter from "./hetter";
import Hutter from "./hutter";
import {} from "@/app/second"; // 選択した日付を取得するためのコンテキスト

const inputPase = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8f8ff", //白よりちょっと暗い色で
        }}
      >
        {/* ヘッダー部分 */}
        <Hetter />
        {/* メイン画面*/}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 40,
            backgroundColor: "",
          }}
        >
          <Input />
        </View>
        {/* フッター部分 */}
        <Hutter />
      </View>
    </TouchableWithoutFeedback>
  );
};
export default inputPase;
