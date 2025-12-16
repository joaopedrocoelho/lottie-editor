import type { CharPart } from "./createrandomchar";

export type RandomChar = Record<CharPart, number>;

export const TOTAL_UNIQUE_CHARS = 5;
export const LOSER_ANIMATIONS = [1, 2, 3, 4, 5] as const;
export const WINNER_ANIMATIONS = [1, 2, 3, 4, 5] as const;
export type LoserAnimation = `loser_${(typeof LOSER_ANIMATIONS)[number]}`;
export type WinnerAnimation = `winner_${(typeof WINNER_ANIMATIONS)[number]}`;

export type AnimationType =
  | "walk"
  | "run_slow"
  | "run_fast"
  | LoserAnimation
  | WinnerAnimation;

export const ANIMATION_TYPES: AnimationType[] = [
  "walk",
  "run_slow",
  "run_fast",
  ...LOSER_ANIMATIONS.map((number) => `loser_${number}` as LoserAnimation),
  ...WINNER_ANIMATIONS.map((number) => `winner_${number}` as WinnerAnimation),
];
