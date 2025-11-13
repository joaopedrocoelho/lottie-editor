import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type {
  LottieObject,
  FillColor,
  GroupedFillColor,
  LottieValue,
} from "../types";

interface LottieDataContextType {
  lottieData: LottieObject | null;
  setLottieData: (data: LottieObject | null) => void;
  fillColors: FillColor[];
  setFillColors: (colors: FillColor[]) => void;
  groupedColors: GroupedFillColor[];
  setGroupedColors: (colors: GroupedFillColor[]) => void;
  updateGroupColor: (groupIndex: number, newColor: number[]) => void;
  animationKey: number;
  setAnimationKey: (key: number) => void;
}

const LottieDataContext = createContext<LottieDataContextType | undefined>(
  undefined
);

export const LottieDataProvider = ({ children }: { children: ReactNode }) => {
  const [lottieData, setLottieData] = useState<LottieObject | null>(null);
  const [fillColors, setFillColors] = useState<FillColor[]>([]);
  const [groupedColors, setGroupedColors] = useState<GroupedFillColor[]>([]);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Update all fills in a group with a new color
  const updateGroupColor = useCallback(
    (groupIndex: number, newColor: number[]) => {
      const group = groupedColors[groupIndex];
      if (!group) return;

      // Update the grouped colors state
      setGroupedColors((prev) => {
        const updated = [...prev];
        updated[groupIndex] = {
          ...updated[groupIndex],
          value: newColor,
        };
        return updated;
      });

      // Update all fills in this group
      setFillColors((prev) => {
        const updated = [...prev];
        group.fills.forEach((groupFill) => {
          const fillIndex = prev.findIndex(
            (f) => JSON.stringify(f.path) === JSON.stringify(groupFill.path)
          );
          if (fillIndex !== -1) {
            updated[fillIndex] = { ...updated[fillIndex], value: newColor };
          }
        });
        return updated;
      });

      // Update the actual lottie data for all fills in the group
      setLottieData((prev) => {
        if (!prev) return prev;
        const newData = JSON.parse(JSON.stringify(prev)) as LottieObject;

        group.fills.forEach((fill) => {
          let target: LottieValue = newData;
          let found = true;

          for (let i = 0; i < fill.path.length; i++) {
            if (
              typeof target === "object" &&
              target !== null &&
              !Array.isArray(target)
            ) {
              target = (target as LottieObject)[fill.path[i]];
            } else {
              found = false;
              break;
            }
          }

          if (
            found &&
            typeof target === "object" &&
            target !== null &&
            !Array.isArray(target) &&
            (target as LottieObject).ty === "fl"
          ) {
            const targetObj = target as LottieObject;
            // Preserve alpha channel if it exists
            const newColorWithAlpha =
              fill.value.length === 4 ? [...newColor, fill.value[3]] : newColor;

            if (fill.isNested) {
              // Update nested structure: c.k
              if (
                targetObj.c &&
                typeof targetObj.c === "object" &&
                targetObj.c !== null &&
                !Array.isArray(targetObj.c)
              ) {
                (targetObj.c as LottieObject).k = newColorWithAlpha;
              }
            } else {
              // Update direct structure: c
              targetObj.c = newColorWithAlpha;
            }
          }
        });

        return newData;
      });

      // Force Lottie component to re-render with updated data
      setAnimationKey((prev) => prev + 1);
    },
    [groupedColors]
  );

  return (
    <LottieDataContext.Provider
      value={{
        lottieData,
        setLottieData,
        fillColors,
        setFillColors,
        groupedColors,
        setGroupedColors,
        updateGroupColor,
        animationKey,
        setAnimationKey,
      }}
    >
      {children}
    </LottieDataContext.Provider>
  );
};

export const useLottieData = () => {
  const context = useContext(LottieDataContext);
  if (context === undefined) {
    throw new Error("useLottieData must be used within a LottieDataProvider");
  }
  return context;
};
