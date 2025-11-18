import { describe, it, expect } from "vitest";
import { findCharPart } from "./switchparts";
import type { LottieObject } from "../types";
import dataPersonagem01 from "../mock/data_personagem_01_correndo.json";
import dataPersonagem02 from "../mock/data_personagem_02_correndo.json";

describe("findCharPart", () => {
  const lottieData01 = dataPersonagem01 as unknown as LottieObject;
  const lottieData02 = dataPersonagem02 as unknown as LottieObject;

  describe("with data_personagem_01_correndo.json", () => {
    it("should find the head part", () => {
      const result = findCharPart(lottieData01, "head");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("head");
      expect((result.asset as LottieObject)["id"]).toBe("comp_3");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("head");
      expect((result.layer as LottieObject)["refId"]).toBe("comp_3");
      expect((result.layer as LottieObject)["ty"]).toBe(0);
    });

    it("should find the acessory part", () => {
      const result = findCharPart(lottieData01, "acessory");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("acessory");
      expect((result.asset as LottieObject)["id"]).toBe("comp_0");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("acessory");
      expect((result.layer as LottieObject)["refId"]).toBe("comp_0");
    });

    it("should find the body part", () => {
      const result = findCharPart(lottieData01, "body");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("body");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("body");
    });

    it("should find the front_arm part", () => {
      const result = findCharPart(lottieData01, "front_arm");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("front_arm");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("front_arm");
    });

    it("should find the back_arm part", () => {
      const result = findCharPart(lottieData01, "back_arm");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("back_arm");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("back_arm");
    });

    it("should find the front_leg part", () => {
      const result = findCharPart(lottieData01, "front_leg");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("front_leg");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("front_leg");
    });

    it("should find the back_leg part", () => {
      const result = findCharPart(lottieData01, "back_leg");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("back_leg");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("back_leg");
    });
  });

  describe("with data_personagem_02_correndo.json", () => {
    it("should find the head part", () => {
      const result = findCharPart(lottieData02, "head");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("head");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("head");
    });

    it("should find the acessory part", () => {
      const result = findCharPart(lottieData02, "acessory");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("acessory");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("acessory");
    });

    it("should find the body part", () => {
      const result = findCharPart(lottieData02, "body");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("body");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("body");
    });

    it("should find the front_arm part", () => {
      const result = findCharPart(lottieData02, "front_arm");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("front_arm");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("front_arm");
    });

    it("should find the back_arm part", () => {
      const result = findCharPart(lottieData02, "back_arm");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("back_arm");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("back_arm");
    });

    it("should find the front_leg part", () => {
      const result = findCharPart(lottieData02, "front_leg");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("front_leg");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("front_leg");
    });

    it("should find the back_leg part", () => {
      const result = findCharPart(lottieData02, "back_leg");

      expect(result.asset).toBeDefined();
      expect(result.asset).not.toBeNull();
      expect((result.asset as LottieObject)["nm"]).toBe("back_leg");

      expect(result.layer).toBeDefined();
      expect(result.layer).not.toBeNull();
      expect((result.layer as LottieObject)["nm"]).toBe("back_leg");
    });
  });

  describe("edge cases", () => {
    it("should return undefined asset and layer for non-existent part", () => {
      // @ts-expect-error - Testing with invalid part name
      const result = findCharPart(lottieData01, "nonexistent");

      expect(result.asset).toBeUndefined();
      expect(result.layer).toBeUndefined();
    });

    it("should handle empty assets array", () => {
      const emptyData: LottieObject = {
        v: "5.12.1",
        fr: 12,
        ip: 0,
        op: 8,
        w: 1920,
        h: 1080,
        assets: [],
        layers: [],
      };

      const result = findCharPart(emptyData, "head");

      expect(result.asset).toBeUndefined();
      expect(result.layer).toBeUndefined();
    });

    it("should handle missing assets property", () => {
      const dataWithoutAssets: LottieObject = {
        v: "5.12.1",
        fr: 12,
        ip: 0,
        op: 8,
        w: 1920,
        h: 1080,
        layers: [],
      };

      // This will throw an error because assets is undefined
      // The function uses ! operator which assumes assets exists
      expect(() => findCharPart(dataWithoutAssets, "head")).toThrow();
    });

    it("should handle missing layers property", () => {
      const dataWithoutLayers: LottieObject = {
        v: "5.12.1",
        fr: 12,
        ip: 0,
        op: 8,
        w: 1920,
        h: 1080,
        assets: [],
      };

      // This will throw an error because layers is undefined
      // The function uses ! operator which assumes layers exists
      expect(() => findCharPart(dataWithoutLayers, "head")).toThrow();
    });
  });

  describe("return value structure", () => {
    it("should return an object with asset and layer properties", () => {
      const result = findCharPart(lottieData01, "head");

      expect(result).toHaveProperty("asset");
      expect(result).toHaveProperty("layer");
      expect(typeof result).toBe("object");
    });

    it("should return different objects for asset and layer", () => {
      const result = findCharPart(lottieData01, "head");

      // Asset is from assets array, layer is from layers array - they should be different
      expect(result.asset).not.toBe(result.layer);
      expect(result.asset).toBeDefined();
      expect(result.layer).toBeDefined();

      // Asset should have an id, layer should have a refId that matches
      const assetId = (result.asset as LottieObject)["id"];
      const layerRefId = (result.layer as LottieObject)["refId"];
      expect(layerRefId).toBe(assetId);
    });
  });
});
