import React, { createContext, useState, useContext } from "react";
import { ReactNode } from "react";

type SelectedDateContextType = {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
};

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(
  undefined
);

type Props = {
  children: ReactNode;
};

export const SelectedDateProvider = ({ children }: Props) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  return (
    <SelectedDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </SelectedDateContext.Provider>
  );
};

export const useSelectedDate = () => {
  const context = useContext(SelectedDateContext);
  if (!context) {
    throw new Error(
      "useSelectedDate must be used within a SelectedDateProvider"
    );
  }
  return context;
};
