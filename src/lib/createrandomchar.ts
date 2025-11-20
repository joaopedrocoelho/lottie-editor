export type CharPart =
  | "accessory"
  | "head"
  | "body"
  | "front_arm"
  | "back_arm"
  | "front_leg"
  | "back_leg";

export interface CharPartJson {
  asset: Record<string, unknown>[];
  layer: Record<string, unknown>;
}
