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
  | LottieObject
  | LottieArray;
export type LottieObject = { [key: string]: LottieValue };
export type LottieArray = LottieValue[];
