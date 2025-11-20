export interface FillColor {
  path: string[];
  value: number[];
  originalValue: number[];
  isNested: boolean; // true if color is in c.k, false if directly in c
}

export interface GroupedFillColor {
  value: number[];
  originalValue: number[];
  fills: FillColor[]; // All fills with this color value
}

export type LottieValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | LottieArray;

export type LottieObject = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: Record<string, unknown>[];
  layers: Record<string, unknown>[];
  markers: Record<string, unknown>[];
  props: Record<string, LottieValue>;
};
export type LottieArray = LottieValue[];
