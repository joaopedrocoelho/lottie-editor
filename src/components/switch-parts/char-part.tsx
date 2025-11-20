import type { LottieObject } from "../../types";
import type { CharPart } from "../../lib/switchparts";
import Lottie from "lottie-react";

export const CharPartComponent = ({
  lottieData,
  animationKey,
  charPart,
}: {
  lottieData: LottieObject;
  animationKey: number;
  charPart: CharPart;
}) => {
  return (
    <div className="flex gap-x-4 rounded-md bg-neutral-600 p-4 items-center">
      <div className="bg-white rounded-lg overflow-hidden">
        <Lottie animationData={lottieData} key={animationKey} loop />
      </div>
      <div className="flex flex-col gap-y-4 w-1/3 flex-1 shrink-0">
        <h2 className="text-3xl">{charPart}</h2>
      </div>
    </div>
  );
};
