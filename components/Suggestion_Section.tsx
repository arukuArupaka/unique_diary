import { useState } from "react";
import { suggestionThemes } from "../data/suggestionThemes";

type SuggestionCategory = "毎日" | "大学生活" | "人生";

const getRandomItem = (category: SuggestionCategory) => {
  const index = Math.floor(Math.random() * suggestionThemes[category].length);
  return suggestionThemes[category][index];
};

export const useSuggestion = () => {
  const [DailySuggestion, setDailySuggestion] = useState(getRandomItem("毎日"));
  const [CollegeSuggestion, setCollegeSuggestion] = useState(
    getRandomItem("大学生活")
  );
  const [LifeSuggestion, setLifeSuggestion] = useState(getRandomItem("人生"));

  const handleSwap = () => {
    setDailySuggestion(getRandomItem("毎日"));
    setCollegeSuggestion(getRandomItem("大学生活"));
    setLifeSuggestion(getRandomItem("人生"));
  };

  return {
    DailySuggestion,
    LifeSuggestion,
    CollegeSuggestion,
    handleSwap,
  };
};
