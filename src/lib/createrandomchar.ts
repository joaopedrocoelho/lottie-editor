import type { LottieObject, LottieArray } from "../types";

export type CharPart =
  | "accessory"
  | "head"
  | "body"
  | "front_arm"
  | "back_arm"
  | "front_leg"
  | "back_leg";

export interface CharPartJson {
  asset: LottieObject;
  layer: LottieObject;
}

// Use static import.meta.glob calls (required for Vite static analysis)
const accessoriesModules = import.meta.glob(
  "../../data/parts/accessory/*.json",
  {
    eager: true,
  }
);
const headsModules = import.meta.glob("../../data/parts/head/*.json", {
  eager: true,
});
const bodiesModules = import.meta.glob("../../data/parts/body/*.json", {
  eager: true,
});
const frontArmsModules = import.meta.glob("../../data/parts/front_arm/*.json", {
  eager: true,
});
const backArmsModules = import.meta.glob("../../data/parts/back_arm/*.json", {
  eager: true,
});
const frontLegsModules = import.meta.glob("../../data/parts/front_leg/*.json", {
  eager: true,
});
const backLegsModules = import.meta.glob("../../data/parts/back_leg/*.json", {
  eager: true,
});

// For JSON files, the default export is the JSON object itself
// When using import.meta.glob with eager: true, modules can be the object directly or have a default property
type JsonModule = CharPartJson | { default: CharPartJson };

const extractJson = (mod: unknown): CharPartJson => {
  const jsonMod = mod as JsonModule;
  return "default" in jsonMod && jsonMod.default
    ? jsonMod.default
    : (jsonMod as CharPartJson);
};

const accessories = Object.values(accessoriesModules).map(
  extractJson
) as CharPartJson[];
const heads = Object.values(headsModules).map(extractJson) as CharPartJson[];
const bodies = Object.values(bodiesModules).map(extractJson) as CharPartJson[];
const frontArms = Object.values(frontArmsModules).map(
  extractJson
) as CharPartJson[];
const backArms = Object.values(backArmsModules).map(
  extractJson
) as CharPartJson[];
const frontLegs = Object.values(frontLegsModules).map(
  extractJson
) as CharPartJson[];
const backLegs = Object.values(backLegsModules).map(
  extractJson
) as CharPartJson[];

const partsMap: Record<CharPart, CharPartJson[]> = {
  accessory: accessories,
  head: heads,
  body: bodies,
  front_arm: frontArms,
  back_arm: backArms,
  front_leg: frontLegs,
  back_leg: backLegs,
} as const;

// Debug: Log parts loading status
if (typeof window !== "undefined") {
  console.log("[createRandomChar] Parts loaded:", {
    accessory: accessories.length,
    head: heads.length,
    body: bodies.length,
    front_arm: frontArms.length,
    back_arm: backArms.length,
    front_leg: frontLegs.length,
    back_leg: backLegs.length,
  });
}

const replacePart = (
  char: LottieObject,
  part: CharPart,
  partData: CharPartJson
) => {
  const newChar = JSON.parse(JSON.stringify(char)) as LottieObject;
  // replace the asset with nm equal to part
  newChar.assets = (newChar.assets as LottieArray)!.map((asset) => {
    if ((asset as LottieObject)["nm"] === part) {
      return partData.asset;
    }
    return asset;
  });
  // replace the layer with nm equal to part
  newChar.layers = (newChar.layers as LottieArray)!.map((layer) => {
    if ((layer as LottieObject)["nm"] === part) {
      return partData.layer;
    }
    return layer;
  });
  return newChar;
};
export const createRandomPart = (char: LottieObject, part: CharPart) => {
  const parts = partsMap[part];
  if (!parts || parts.length === 0) {
    console.warn(`No parts found for ${part}, returning original character`);
    return char;
  }
  const number = Math.floor(Math.random() * parts.length);
  const partData = parts[number];
  if (!partData || !partData.asset || !partData.layer) {
    console.warn(`Invalid part data for ${part}, returning original character`);
    return char;
  }
  return replacePart(char, part, partData);
};

export const createRandomChar = (char: LottieObject) => {
  let newChar = JSON.parse(JSON.stringify(char)) as LottieObject;
  for (const part of Object.keys(partsMap) as CharPart[]) {
    newChar = createRandomPart(newChar, part);
  }
  return newChar;
};
