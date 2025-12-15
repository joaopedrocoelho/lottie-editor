import type { CharPart } from "@/lib/createrandomchar";
import type { CharPartJson } from "@/lib/createrandomchar";
import { TOTAL_UNIQUE_CHARS } from "@/lib/consts";
import type { LottieObject } from "@/types";
import { walkBase } from "../chars/base";

export type RandomChar = Record<CharPart, number>;
export type AnimationType =
  | "walk"
  | "run_fast"
  | "run_slow"
  | "loser"
  | "winner";

export const generateRandomChar = (): RandomChar => {
  const randomChar = {
    accessory: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    head: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    body: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    front_arm: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    back_arm: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    front_leg: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
    back_leg: Math.floor(Math.random() * TOTAL_UNIQUE_CHARS),
  };

  console.log(randomChar);
  return randomChar;
};

export const getAnimatioBaseChart = (
  animationType: AnimationType
): LottieObject => {
  switch (animationType) {
    default:
    case "walk":
      return walkBase;
    // case "run_fast":
    //   return runFastBase;
    // case "run_slow":
    //   return runSlowBase;
  }
};
// Create a glob pattern for dynamic imports of char part JSON files
const charPartModules = import.meta.glob<CharPartJson>("../chars/*/*/*.json", {
  eager: false,
});

const stackOrderModules = import.meta.glob<{
  [x: string]: CharPart[];
}>("../chars/originals/*/*.json", {
  eager: false,
});

/**
 * Dynamically load a char part JSON file based on part, animationType, and character number
 */
const loadCharPart = async (
  part: CharPart,
  animationType: AnimationType,
  characterNumber: number
): Promise<CharPartJson> => {
  // Convert character number (0-indexed) to 1-indexed for file naming
  const fileNumber = characterNumber + 1;
  const path = `../chars/${part}/${animationType}/${fileNumber}.json`;

  const loader = charPartModules[path];
  if (!loader) {
    throw new Error(
      `Char part not found: ${part}/${animationType}/${fileNumber}.json`
    );
  }

  const module = await loader();
  // Vite may return JSON directly or wrapped in default
  return (
    (module as { default?: CharPartJson }).default || (module as CharPartJson)
  );
};

/**
 *
 * Dynamically load animationType stack order
 */
export const loadAnimationStackOrder = async (
  animationType: AnimationType
): Promise<CharPart[]> => {
  const path = `../chars/originals/${animationType}/stack-order.json`;
  const loader = stackOrderModules[path];
  if (!loader) {
    throw new Error(`Stack order not found: ${path}`);
  }
  const module = await loader();
  return module[animationType];
};

export const generateCharAnimation = async (
  randomChar: RandomChar,
  animationType: AnimationType
): Promise<LottieObject> => {
  // Create a deep copy of baseChar to avoid mutating the original
  // We need to create new arrays to prevent mutation
  const char: LottieObject = {
    ...getAnimatioBaseChart(animationType),
    assets: [],
    layers: [],
    markers: [...getAnimatioBaseChart(animationType).markers],
  };
  const parts = await loadAnimationStackOrder(animationType);

  // Dynamically load and add each part
  for (const part of parts) {
    const charPart = await loadCharPart(part, animationType, randomChar[part]);
    char["assets"].push(...charPart.asset);
    char["layers"].push(charPart.layer);
  }
  console.log(char);
  return char;
};

/**
 * Generate a character JSON with default "walk" animation type
 * This is a convenience wrapper for generateCharAnimation
 */
export const generateCharJson = async (
  randomChar: RandomChar,
  animationType: AnimationType = "walk"
): Promise<LottieObject> => {
  return generateCharAnimation(randomChar, animationType);
};
