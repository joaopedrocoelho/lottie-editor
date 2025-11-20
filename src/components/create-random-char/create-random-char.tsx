import { useMemo, useEffect } from "react";
import { createRandomChar } from "../../lib/createrandomchar";
import { useLottieData } from "../../context/lottie-data-provider";
import Preview from "../preview";
import { Button } from "../ui/button";
import type { LottieObject } from "../../types";
import dataPersonagem01 from "../../../data/chars/data_personagem_01_correndo.json";

const CreateRandomChar = () => {
  const { lottieData, setLottieData, animationKey, setAnimationKey } =
    useLottieData();

  // Initialize base character from imported data
  const baseChar = useMemo(() => {
    return dataPersonagem01 as unknown as LottieObject;
  }, []);

  // Initialize lottieData with base character on mount
  useEffect(() => {
    if (!lottieData && baseChar) {
      setLottieData(baseChar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateRandom = () => {
    if (!baseChar) return;

    console.log("[CreateRandomChar] Generating random character...");
    const randomChar = createRandomChar(baseChar);
    console.log("[CreateRandomChar] Random character generated:", {
      hasAssets: !!randomChar.assets,
      hasLayers: !!randomChar.layers,
      assetsCount: Array.isArray(randomChar.assets)
        ? randomChar.assets.length
        : 0,
      layersCount: Array.isArray(randomChar.layers)
        ? randomChar.layers.length
        : 0,
    });
    setLottieData(randomChar);
    // Force re-render of the Lottie component
    setAnimationKey(animationKey + 1);
  };

  return (
    <div className="w-full h-full py-12">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            Create Random Character
          </h1>
          <p className="text-white/70">
            Generate a random character by mixing different parts
          </p>
        </div>

        <Button
          onClick={handleGenerateRandom}
          disabled={!baseChar}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Generate Random Character
        </Button>

        <div className="w-full max-w-2xl">
          <Preview lottieData={lottieData} animationKey={animationKey} />
        </div>
      </div>
    </div>
  );
};

export default CreateRandomChar;
