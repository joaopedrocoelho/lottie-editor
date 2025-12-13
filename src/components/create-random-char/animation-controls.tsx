import type { LottieRefCurrentProps } from "lottie-react";

interface AnimationControlsProps {
  lottieRef: React.RefObject<LottieRefCurrentProps | null>;
  setHueRotation: React.Dispatch<React.SetStateAction<number>>;
  setSaturation: React.Dispatch<React.SetStateAction<number>>;
}

export default function AnimationControls({
  lottieRef,
  setHueRotation,
  setSaturation,
}: AnimationControlsProps) {
  return (
    <div className="flex gap-x-4">
      <button
        type="button"
        onClick={() => {
          if (lottieRef.current) {
            lottieRef.current.setSpeed(1.5);
          }
        }}
        className="animation-control w-fit"
      >
        Speed Up
      </button>
      <button
        type="button"
        onClick={() => {
          setHueRotation((prev) => prev - 20);
        }}
        className="animation-control w-fit"
      >
        Decrease Hue (-20°)
      </button>
      <button
        type="button"
        onClick={() => {
          setHueRotation((prev) => prev + 20);
        }}
        className="animation-control w-fit"
      >
        Increase Hue (+20°)
      </button>
      <button
        type="button"
        onClick={() => {
          setSaturation((prev) => Math.max(0, prev - 15));
        }}
        className="animation-control w-fit"
      >
        Decrease Saturation (-15%)
      </button>
      <button
        type="button"
        onClick={() => {
          setSaturation((prev) => prev + 15);
        }}
        className="animation-control w-fit"
      >
        Increase Saturation (+15%)
      </button>
    </div>
  );
}
