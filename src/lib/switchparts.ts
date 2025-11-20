import type { LottieObject, LottieArray, LottieValue } from "../types";

export type CharPart =
  | "accessory"
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

export const createCharPartLottie = ({
  asset,
  layer,
}: {
  asset: LottieValue;
  layer: LottieValue;
}): LottieObject => {
  return {
    v: "5.12.1",
    fr: 12,
    ip: 0,
    op: 8,
    w: 1920,
    h: 1080,
    assets: [asset],
    layers: [layer],
  };
};

export const charPartLottieList = (LottieData: LottieObject) => {
  const partList: Record<CharPart, LottieObject> = {
    accessory: {},
    head: {},
    body: {},
    front_arm: {},
    back_arm: {},
    front_leg: {},
    back_leg: {},
  };
  for (const part of Object.keys(partList) as CharPart[]) {
    const { asset, layer } = findCharPart(LottieData, part);
    partList[part] = createCharPartLottie({ asset: asset!, layer: layer! });
  }
  return partList;
};
