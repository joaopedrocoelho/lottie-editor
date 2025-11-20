import { useRef, useState } from "react";
import type { LottieObject } from "@/types";
import { generateCharJson, generateRandomChar } from "./utils";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

const CreateRandomChar = () => {
  const [char, setChar] = useState<LottieObject>();
  const [key, setKey] = useState<number>(0);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [hueRotation, setHueRotation] = useState(0);
  const [saturation, setSaturation] = useState(100);

  return (
    <div className="flex flex-col gap-y-4 pt-12">
      <div className="flex gap-x-4">
        <button
          type="button"
          onClick={() => {
            const randomChar = generateRandomChar();
            const charJson = generateCharJson(randomChar);
            setChar(charJson);
            setKey((prev) => prev + 1);
          }}
          className="upload-button w-fit"
        >
          Generate Random Char
        </button>
      </div>
      <div className="lottie-container">
        {char ? (
          <div
            style={{
              filter: `hue-rotate(${hueRotation}deg) saturate(${saturation}%)`,
            }}
          >
            <Lottie
              key={key}
              animationData={char}
              loop={true}
              lottieRef={lottieRef}
            />
          </div>
        ) : (
          <p
            className="no-fills"
            style={{ textAlign: "center", color: "black" }}
          >
            No Lottie data found. Please upload a Lottie JSON file.
          </p>
        )}
      </div>
      <div className="flex gap-x-4">
        <button
          type="button"
          onClick={() => {
            if (lottieRef.current) {
              lottieRef.current.setSpeed(1.5);
            }
          }}
          className="upload-button w-fit"
        >
          Speed Up
        </button>
        <button
          type="button"
          onClick={() => {
            setHueRotation((prev) => prev - 20);
          }}
          className="upload-button w-fit"
        >
          Decrease Hue (-20°)
        </button>
        <button
          type="button"
          onClick={() => {
            setHueRotation((prev) => prev + 20);
          }}
          className="upload-button w-fit"
        >
          Increase Hue (+20°)
        </button>
        <button
          type="button"
          onClick={() => {
            setSaturation((prev) => Math.max(0, prev - 15));
          }}
          className="upload-button w-fit"
        >
          Decrease Saturation (-15%)
        </button>
        <button
          type="button"
          onClick={() => {
            setSaturation((prev) => prev + 15);
          }}
          className="upload-button w-fit"
        >
          Increase Saturation (+15%)
        </button>
      </div>
    </div>
  );
};

export default CreateRandomChar;
