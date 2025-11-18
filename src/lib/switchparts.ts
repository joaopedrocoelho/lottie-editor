import type { LottieObject, LottieArray } from "../types";

export type CharPart =
  | "acessory"
  | "head"
  | "body"
  | "front_arm"
  | "back_arm"
  | "front_leg"
  | "back_leg";

export const findCharPart = (lottieData: LottieObject, part: CharPart) => {
  const asset = (lottieData!["assets"] as LottieArray).find(
    (asset) => (asset as LottieObject)["nm"] === part
  );

  const layer = (lottieData!["layers"] as LottieArray).find(
    (layer) => (layer as LottieObject)["nm"] === part
  );

  return {
    asset,
    layer,
  };
};
