import type { CharPart } from "@/lib/createrandomchar";
import type { CharPartJson } from "@/lib/createrandomchar";
import { TOTAL_UNIQUE_CHARS } from "@/lib/consts";
import type { LottieObject } from "@/types";
import { walkBase, runSlowBase, runFastBase } from "../chars/base";
import { loser2Base } from "../chars/loser-base";
import type { RandomChar, AnimationType } from "@/lib/consts";
import { isCharPart } from "@/lib/createrandomchar";
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
  // Handle loser animations
  if (animationType.startsWith("loser_")) {
    const number = parseInt(animationType.split("_")[1]);
    if (number === 2) {
      return loser2Base;
    }
    // Add other loser bases here as they're implemented
    throw new Error(`Loser animation ${number} not yet implemented`);
  }

  // Handle winner animations
  if (animationType.startsWith("winner_")) {
    // Add winner bases here as they're implemented
    throw new Error(`Winner animations not yet implemented`);
  }

  // Handle regular animations
  switch (animationType) {
    default:
    case "walk":
      return walkBase;
    case "run_slow":
      return runSlowBase;
    case "run_fast":
      return runFastBase;
  }
};
// Create a glob pattern for dynamic imports of char part JSON files
// This pattern matches both 3-level paths (walk, run_fast, etc.) and 4-level paths (loser/2, winner/3, etc.)
const charPartModules = import.meta.glob<CharPartJson>("../chars/**/*.json", {
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

  // Handle loser and winner animations - they use format loser_2, winner_3, etc.
  let path: string;
  if (animationType.startsWith("loser_")) {
    const loserNumber = animationType.split("_")[1];
    path = `../chars/${part}/loser/${loserNumber}/${fileNumber}.json`;
  } else if (animationType.startsWith("winner_")) {
    const winnerNumber = animationType.split("_")[1];
    path = `../chars/${part}/winner/${winnerNumber}/${fileNumber}.json`;
  } else {
    path = `../chars/${part}/${animationType}/${fileNumber}.json`;
  }

  const loader = charPartModules[path];
  if (!loader) {
    throw new Error(`Char part not found: ${path}`);
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
  // Handle loser and winner animations - they use format loser_2, winner_3, etc.
  // The stack-order.json uses keys like "loser02", "winner03", etc.
  let path: string;
  let stackOrderKey: string;

  if (animationType.startsWith("loser_")) {
    const loserNumber = animationType.split("_")[1];
    path = `../chars/originals/loser/stack-order.json`;
    stackOrderKey = `loser${loserNumber.padStart(2, "0")}`;
  } else if (animationType.startsWith("winner_")) {
    const winnerNumber = animationType.split("_")[1];
    path = `../chars/originals/winner/stack-order.json`;
    stackOrderKey = `winner${winnerNumber.padStart(2, "0")}`;
  } else {
    path = `../chars/originals/${animationType}/stack-order.json`;
    stackOrderKey = animationType;
  }

  const loader = stackOrderModules[path];
  if (!loader) {
    throw new Error(`Stack order not found: ${path}`);
  }
  const module = await loader();
  return module[stackOrderKey];
};

export const generateCharAnimation = async (
  randomChar: RandomChar,
  animationType: AnimationType
): Promise<LottieObject> => {
  console.log("=== generateCharAnimation ===");
  console.log("randomChar:", randomChar);
  console.log("animationType:", animationType);

  // Get the base chart
  const baseChart = getAnimatioBaseChart(animationType);

  // Create a deep copy of baseChar to avoid mutating the original
  // Preserve existing assets and layers from the base (e.g., tears in loser2Base)
  const char: LottieObject = {
    ...baseChart,
    assets: [...baseChart.assets],
    layers: [...baseChart.layers],
    markers: [...baseChart.markers],
  };
  const parts = await loadAnimationStackOrder(animationType);
  console.log("parts:", parts);

  // Load all character parts in parallel first, then add them in order
  // This ensures all dynamic imports are fully resolved before processing
  const validParts = parts.filter(isCharPart);
  const loadedParts = await Promise.all(
    validParts.map((part) =>
      loadCharPart(part, animationType, randomChar[part])
    )
  );
  console.log("loadedParts:", loadedParts);

  // Add parts in the correct stack order
  for (const charPart of loadedParts) {
    char["assets"].push(...charPart.asset);
    char["layers"].push(charPart.layer);
  }

  console.log("final char:", char);
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
