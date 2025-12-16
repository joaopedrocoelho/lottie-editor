export const CHAR_PARTS = [
  "accessory",
  "head",
  "body",
  "front_arm",
  "back_arm",
  "front_leg",
  "back_leg",
] as const;

export type CharPart = (typeof CHAR_PARTS)[number];

export const isCharPart = (part: string): part is CharPart => {
  return (CHAR_PARTS as readonly string[]).includes(part);
};
export interface CharPartJson {
  asset: Record<string, unknown>[];
  layer: Record<string, unknown>;
}
