import { useRef, useState } from "react";
import type { LottieObject } from "@/types";
import { generateCharAnimation, generateRandomChar } from "./functions";
import type { RandomChar, AnimationType } from "@/lib/consts";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AnimationControls from "./animation-controls";
import CharDataDisplay from "./char-data-display";
import AnimationTypesSelector from "./animation-types-selector";

const CreateRandomChar = () => {
  const [char, setChar] = useState<LottieObject>();
  const [key, setKey] = useState<number>(0);
  const [randomChar, setRandomChar] = useState<RandomChar | null>(null);
  const [currentAnimationType, setCurrentAnimationType] =
    useState<AnimationType>("walk");
  const [isLoading, setIsLoading] = useState(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [hueRotation, setHueRotation] = useState(0);
  const [saturation, setSaturation] = useState(100);

  const handleGenerateRandomChar = async () => {
    setIsLoading(true);
    try {
      const newRandomChar = generateRandomChar();
      setRandomChar(newRandomChar);
      const charJson = await generateCharAnimation(newRandomChar, "walk");
      setChar(charJson);
      setCurrentAnimationType("walk");
      setKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error generating character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimationTypeChange = async (animationType: AnimationType) => {
    if (!randomChar) {
      // If no random char exists, generate one first
      await handleGenerateRandomChar();
      return;
    }

    setIsLoading(true);
    try {
      const charJson = await generateCharAnimation(randomChar, animationType);
      setChar(charJson);
      setCurrentAnimationType(animationType);
      setKey((prev) => prev + 1);
    } catch (error) {
      console.error(`Error loading ${animationType} animation:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-6 pt-12">
      {/* Main content area */}
      <div className="flex-1 flex flex-col gap-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 flex-wrap">
            <button
              type="button"
              onClick={handleGenerateRandomChar}
              disabled={isLoading}
              className="upload-button w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Random Char"}
            </button>
          </div>

          {/* Animation type buttons */}
          {randomChar && (
            <AnimationTypesSelector
              handleAnimationTypeChange={handleAnimationTypeChange}
              isLoading={isLoading}
              currentAnimationType={currentAnimationType}
            />
          )}
        </div>

        <div className="lottie-container w-1/3">
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
              No Lottie data found. Please generate a random character.
            </p>
          )}
        </div>

        <AnimationControls
          lottieRef={lottieRef}
          setHueRotation={setHueRotation}
          setSaturation={setSaturation}
        />
      </div>

      {/* Side panel */}
      <div className="w-64 shrink-0">
        <CharDataDisplay randomChar={randomChar} />
      </div>
    </div>
  );
};

export default CreateRandomChar;
