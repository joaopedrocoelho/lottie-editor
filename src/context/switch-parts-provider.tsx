import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { LottieObject } from "../types";

interface SwitchPartsContextType {
  lottieDataA: LottieObject | null;
  setLottieDataA: (data: LottieObject | null) => void;
  lottieDataB: LottieObject | null;
  setLottieDataB: (data: LottieObject | null) => void;
  animationKeyA: number;
  setAnimationKeyA: (key: number) => void;
  animationKeyB: number;
  setAnimationKeyB: (key: number) => void;
}

const SwitchPartsContext = createContext<SwitchPartsContextType | undefined>(
  undefined
);

export const SwitchPartsProvider = ({ children }: { children: ReactNode }) => {
  const [lottieDataA, setLottieDataA] = useState<LottieObject | null>(null);
  const [lottieDataB, setLottieDataB] = useState<LottieObject | null>(null);
  const [animationKeyA, setAnimationKeyA] = useState<number>(0);
  const [animationKeyB, setAnimationKeyB] = useState<number>(0);

  return (
    <SwitchPartsContext.Provider
      value={{
        lottieDataA,
        setLottieDataA,
        lottieDataB,
        setLottieDataB,
        animationKeyA,
        setAnimationKeyA,
        animationKeyB,
        setAnimationKeyB,
      }}
    >
      {children}
    </SwitchPartsContext.Provider>
  );
};

export const useSwitchParts = () => {
  const context = useContext(SwitchPartsContext);
  if (context === undefined) {
    throw new Error("useSwitchParts must be used within a SwitchPartsProvider");
  }
  return context;
};
