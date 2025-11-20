import type { CharPart } from "@/lib/switchparts";
import { baseChar } from "../chars/base";
import { charPartsMap } from "../chars";
import type { LottieObject } from "@/types";

type RandomChar = Record<CharPart, number>;

export const generateRandomChar = (): RandomChar => {
  const randomChar = {
    accessory: Math.floor(Math.random() * charPartsMap.accessory.length),
    head: Math.floor(Math.random() * charPartsMap.head.length),
    body: Math.floor(Math.random() * charPartsMap.body.length),
    front_arm: Math.floor(Math.random() * charPartsMap.body.length),
    back_arm: Math.floor(Math.random() * charPartsMap.back_arm.length),
    front_leg: Math.floor(Math.random() * charPartsMap.front_leg.length),
    back_leg: Math.floor(Math.random() * charPartsMap.back_leg.length),
  };

  console.log(randomChar);
  return randomChar;
};

/* ok parts
accessory
head
body
front_arm
*/
export const generateCharJson = (randomChar: RandomChar): LottieObject => {
  // Create a deep copy of baseChar to avoid mutating the original
  // We need to create new arrays to prevent mutation
  const char: LottieObject = {
    ...baseChar,
    assets: [],
    layers: [],
    markers: [...baseChar.markers],
  };
  const parts: CharPart[] = [
    "accessory",
    "front_arm",
    "head",
    "body",
    "back_arm",
    "front_leg",
    "back_leg",
  ];

  for (const part of parts) {
    char["assets"].push(...charPartsMap[part][randomChar[part]].asset);
    char["layers"].push(charPartsMap[part][randomChar[part]].layer);
  }
  console.log(char);
  return char;
};
