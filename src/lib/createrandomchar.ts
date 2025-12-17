// Standard parts shown in the UI selector
export const STANDARD_CHAR_PARTS = [
  "accessory",
  "head",
  "body",
  "front_arm",
  "back_arm",
  "front_leg",
  "back_leg",
] as const;

// Extended parts for specific animations (derived from back_arm value)
export const EXTENDED_CHAR_PARTS = [
  "back_hand", // winner01
  "back_forearm", // loser01
  "back_forearm02", // loser01
] as const;

// All parts combined
export const CHAR_PARTS = [
  ...STANDARD_CHAR_PARTS,
  ...EXTENDED_CHAR_PARTS,
] as const;

export type CharPart = (typeof CHAR_PARTS)[number];
export type StandardCharPart = (typeof STANDARD_CHAR_PARTS)[number];

export const isCharPart = (part: string): part is CharPart => {
  return (CHAR_PARTS as readonly string[]).includes(part);
};
export interface CharPartJson {
  asset: Record<string, unknown>[];
  layer: Record<string, unknown>;
}
