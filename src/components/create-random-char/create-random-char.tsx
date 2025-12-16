import { useRef, useState } from "react";
import type { LottieObject } from "@/types";
import { generateCharAnimation, generateRandomChar } from "./functions";
import type { RandomChar, AnimationType } from "@/lib/consts";
import type { CharPart } from "@/lib/createrandomchar";
import { CHAR_PARTS } from "@/lib/createrandomchar";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import AnimationControls from "./animation-controls";
import CharDataDisplay from "./char-data-display";
import AnimationTypesSelector from "./animation-types-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Manual character generation state (stored as 0-4 internally, displayed as 1-5)
  const [manualCharParts, setManualCharParts] = useState<
    Record<CharPart, number>
  >({
    accessory: 0, // 0 = display value 1
    head: 0,
    body: 0,
    front_arm: 0,
    back_arm: 0,
    front_leg: 0,
    back_leg: 0,
  });

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

  const handleManualCharPartChange = (part: CharPart, value: string) => {
    setManualCharParts((prev) => ({
      ...prev,
      [part]: parseInt(value) - 1, // Convert 1-5 to 0-4 for RandomChar
    }));
  };

  const handleGenerateManualChar = async () => {
    setIsLoading(true);
    try {
      // Convert manualCharParts (1-5) to RandomChar format (0-4)
      const newRandomChar: RandomChar = {
        accessory: manualCharParts.accessory,
        head: manualCharParts.head,
        body: manualCharParts.body,
        front_arm: manualCharParts.front_arm,
        back_arm: manualCharParts.back_arm,
        front_leg: manualCharParts.front_leg,
        back_leg: manualCharParts.back_leg,
      };
      setRandomChar(newRandomChar);
      const charJson = await generateCharAnimation(
        newRandomChar,
        currentAnimationType
      );
      setChar(charJson);
      setKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error generating manual character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-6 pt-12">
      {/* Main content area */}
      <div className="flex-1 flex flex-col gap-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-x-4 flex-wrap items-center">
            <button
              type="button"
              onClick={handleGenerateRandomChar}
              disabled={isLoading}
              className="upload-button w-fit disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Random Char"}
            </button>

            {/* Manual character generation */}
            <div className="flex gap-x-2 items-end flex-wrap">
              {CHAR_PARTS.map((part) => (
                <div key={part} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-300 dark:text-gray-300 capitalize">
                    {part.replace("_", " ")}
                  </label>
                  <Select
                    value={(manualCharParts[part] + 1).toString()}
                    onValueChange={(value) =>
                      handleManualCharPartChange(part, value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-16 h-9 text-sm bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((number) => (
                        <SelectItem key={number} value={number.toString()}>
                          {number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <button
                type="button"
                onClick={handleGenerateManualChar}
                disabled={isLoading}
                className="upload-button w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate Char"}
              </button>
            </div>
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
