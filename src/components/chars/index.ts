import type { CharPart, CharPartJson } from "@/lib/createrandomchar";
import { accessory } from "./accessory";
import { head } from "./head";
import { body } from "./body";
import { front_arm } from "./front_arm";
import { back_arm } from "./back_arm";
import { front_leg } from "./front_leg";
import { back_leg } from "./back_leg";

export const charPartsMap: Record<CharPart, CharPartJson[]> = {
  accessory: accessory,
  head: head,
  body: body,
  front_arm: front_arm,
  back_arm: back_arm,
  front_leg: front_leg,
  back_leg: back_leg,
};
