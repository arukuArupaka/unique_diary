import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

type Slide = {
  key: string;
  title: string;
  subtitle: string;
};

const slides: Slide[] = [
  {
    key: "1",
    title: "日記、続いたことありますか？",
    subtitle:
      "何度も始めて、何度もやめた。\nでも、毎日ちょっと書けたら、きっと変われる。",
  },
  {
    key: "2",
    title: "stepinは“続ける”を助けます",
    subtitle: "毎日の質問と、通知と、記録の火が、\nあなたの習慣を守ります。",
  },
  {
    key: "3",
    title: "書きたくなる仕掛け、たくさん",
    subtitle: "毎日の質問、シンプルな画面、\n継続のごほうび。",
  },
  {
    key: "4",
    title: "あなたのペースで続けてみませんか？",
    subtitle:
      "大切なのは、ちょっとだけでも“続ける”こと。\nあなたの1日を、stepinと一緒に。",
  },
];

const SlideItem: React.FC<{ item: Slide }> = ({ item }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.slide, { opacity: fadeAnim }]}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Animated.View>
  );
};

const WalkthroughScreen = () => {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const goToHome = () => {
    router.replace("/main/InputPase"); // ← トップではなく日記画面へ遷移
  };

  const renderItem = ({ item }: { item: Slide }) => <SlideItem item={item} />;

  const renderIndicators = () => (
    <View style={styles.indicatorContainer}>
      {slides.map((_, i) => {
        const backgroundColor = i === currentIndex ? "#FF7F50" : "#ccc";
        return <View key={i} style={[styles.indicator, { backgroundColor }]} />;
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        keyExtractor={(item) => item.key}
      />

      {renderIndicators()}

      {currentIndex === slides.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.buttonText}>はじめる</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WalkthroughScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  slide: {
    width: width,
    alignItems: "center",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "#FF7F50",
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  indicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 120,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
});
