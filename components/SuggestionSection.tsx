import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { suggestionThemes } from "../data/suggestionThemes";

type Category = keyof typeof suggestionThemes;

export default function SuggestionSection() {
  const [suggestions, setSuggestions] = useState<Record<Category, string>>({
    毎日: "",
    人生: "",
    大学生活: "",
  });

  const generateSuggestions = () => {
    const newSuggestions = {} as Record<Category, string>;
    (Object.keys(suggestionThemes) as Category[]).forEach((category) => {
      const items = suggestionThemes[category];
      newSuggestions[category] =
        items[Math.floor(Math.random() * items.length)];
    });
    setSuggestions(newSuggestions);
  };

  useEffect(() => {
    generateSuggestions();
  }, []);

  return (
    <View style={{ padding: 16, backgroundColor: "#f5f5f5" }}>
      <TouchableOpacity onPress={generateSuggestions}>
        <Text style={{ color: "#4db5ff", fontSize: 16, marginBottom: 12 }}>
          提案を更新
        </Text>
      </TouchableOpacity>
      {Object.entries(suggestions).map(([category, content]) => (
        <View
          key={category}
          style={{
            backgroundColor: "#ffffff",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            {category}
          </Text>
          <Text>{content}</Text>
        </View>
      ))}
    </View>
  );
}
