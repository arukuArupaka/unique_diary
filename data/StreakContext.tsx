// data/StreakContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type StreakContextType = {
  streak: number;
  setStreak: React.Dispatch<React.SetStateAction<number>>;
};

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  const [streak, setStreak] = useState<number>(0);

  return (
    <StreakContext.Provider value={{ streak, setStreak }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = (p0: number) => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error("useStreak must be used within a StreakProvider");
  }
  return context;
};
