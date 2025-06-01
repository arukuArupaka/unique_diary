export function useLifeSuggestion() {
  const DailySuggestion = ["今日の提案1", "今日の提案2"];
  const LifeSuggestion = ["生活の提案1", "生活の提案2"];
  const CollegeSuggestion = ["大学の提案1", "大学の提案2"];
  const handleSwap = () => {
    console.log("スワップ処理");
  };
  return { DailySuggestion, LifeSuggestion, CollegeSuggestion, handleSwap };
}
