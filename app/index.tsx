import { Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#e0ffff",
      }}
    >
      <View
        style={{
          marginTop: "10%",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "10%",
          backgroundColor: "blue",
          flexDirection: "row",
          gap: 20,
        }}
      >
        <View>
          <Text
            style={{
              color: "white",
              //textAlign: "center",
              fontSize: 30,
              backgroundColor: "red",
            }}
          >
            X月X日
          </Text>
        </View>

        <Feather name="bell" size={32} color="black" />
        <View style={{ width: 32, height: 32, backgroundColor: "white" }}>
          <View
            style={{
              width: "100%",
              height: "20%",
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
            }}
          >
            <Text style={{ fontSize: 24 }}>17</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
