import type { LottieObject } from "../../types";
import { charPartLottieList, type CharPart } from "@/lib/switchparts";
import { CharPartComponent } from "./char-part";

export const CharParts = ({ lottieData }: { lottieData: LottieObject }) => {
  const parts = charPartLottieList(lottieData);
  return (
    <ul className="flex flex-col gap-y-4">
      {(Object.keys(parts) as CharPart[]).map((part) => (
        <li key={part} className="flex gap-x-8">
          <CharPartComponent
            lottieData={parts[part]}
            animationKey={0}
            charPart={part}
          />
        </li>
      ))}
    </ul>
  );
};
