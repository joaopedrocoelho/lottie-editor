import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createRandomPart,
  createRandomChar,
  type CharPart,
} from "./createrandomchar";
import type { LottieObject } from "../types";
import dataPersonagem01 from "../../data/chars/data_personagem_01_correndo.json";
import dataPersonagem02 from "../../data/chars/data_personagem_02_correndo.json";

describe("createRandomPart", () => {
  const lottieData01 = dataPersonagem01 as unknown as LottieObject;
  const lottieData02 = dataPersonagem02 as unknown as LottieObject;

  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const partTypes: CharPart[] = [
    "accessory",
    "head",
    "body",
    "front_arm",
    "back_arm",
    "front_leg",
    "back_leg",
  ];

  describe("with data_personagem_01_correndo.json", () => {
    partTypes.forEach((part) => {
      it(`should return valid Lottie JSON when replacing ${part} part`, () => {
        const result = createRandomPart(lottieData01, part);

        // Validate basic Lottie structure
        expect(result).toBeDefined();
        expect(result).toHaveProperty("v");
        expect(result).toHaveProperty("fr");
        expect(result).toHaveProperty("assets");
        expect(result).toHaveProperty("layers");
        expect(Array.isArray(result.assets)).toBe(true);
        expect(Array.isArray(result.layers)).toBe(true);

        // Validate the specific part exists with correct name
        const asset = (result.assets as LottieObject[]).find(
          (a) => (a as LottieObject)["nm"] === part
        );
        const layer = (result.layers as LottieObject[]).find(
          (l) => (l as LottieObject)["nm"] === part
        );

        expect(asset).toBeDefined();
        expect((asset as LottieObject)["nm"]).toBe(part);
        expect(asset).toHaveProperty("id");

        expect(layer).toBeDefined();
        expect((layer as LottieObject)["nm"]).toBe(part);
        expect(layer).toHaveProperty("ty");

        // Validate result can be serialized/deserialized as JSON
        expect(() => JSON.parse(JSON.stringify(result))).not.toThrow();
      });
    });

    it("should not mutate the original character", () => {
      const originalAssets = JSON.parse(JSON.stringify(lottieData01.assets));
      const originalLayers = JSON.parse(JSON.stringify(lottieData01.layers));

      createRandomPart(lottieData01, "head");

      expect(lottieData01.assets).toEqual(originalAssets);
      expect(lottieData01.layers).toEqual(originalLayers);
    });

    it("should maintain all parts in the result", () => {
      const result = createRandomPart(lottieData01, "head");

      // All part types should still exist
      partTypes.forEach((part) => {
        const asset = (result.assets as LottieObject[]).find(
          (a) => (a as LottieObject)["nm"] === part
        );
        const layer = (result.layers as LottieObject[]).find(
          (l) => (l as LottieObject)["nm"] === part
        );

        expect(asset).toBeDefined();
        expect(layer).toBeDefined();
      });
    });

    it("should maintain the same number of assets and layers", () => {
      const originalAssetsCount = (lottieData01.assets as LottieObject[])
        .length;
      const originalLayersCount = (lottieData01.layers as LottieObject[])
        .length;

      const result = createRandomPart(lottieData01, "head");

      expect((result.assets as LottieObject[]).length).toBe(
        originalAssetsCount
      );
      expect((result.layers as LottieObject[]).length).toBe(
        originalLayersCount
      );
    });
  });

  describe("with data_personagem_02_correndo.json", () => {
    it("should return valid Lottie JSON", () => {
      const result = createRandomPart(lottieData02, "accessory");

      expect(result).toBeDefined();
      expect(result).toHaveProperty("v");
      expect(result).toHaveProperty("fr");
      expect(result).toHaveProperty("assets");
      expect(result).toHaveProperty("layers");
      expect(Array.isArray(result.assets)).toBe(true);
      expect(Array.isArray(result.layers)).toBe(true);

      // Validate the accessory part
      const asset = (result.assets as LottieObject[]).find(
        (a) => (a as LottieObject)["nm"] === "accessory"
      );
      const layer = (result.layers as LottieObject[]).find(
        (l) => (l as LottieObject)["nm"] === "accessory"
      );

      expect(asset).toBeDefined();
      expect((asset as LottieObject)["nm"]).toBe("accessory");
      expect(layer).toBeDefined();
      expect((layer as LottieObject)["nm"]).toBe("accessory");

      // Validate result can be serialized/deserialized as JSON
      expect(() => JSON.parse(JSON.stringify(result))).not.toThrow();
    });

    it("should not mutate the original character", () => {
      const originalAssets = JSON.parse(JSON.stringify(lottieData02.assets));
      const originalLayers = JSON.parse(JSON.stringify(lottieData02.layers));

      createRandomPart(lottieData02, "head");

      expect(lottieData02.assets).toEqual(originalAssets);
      expect(lottieData02.layers).toEqual(originalLayers);
    });
  });
});

describe("createRandomChar", () => {
  const lottieData01 = dataPersonagem01 as unknown as LottieObject;
  const lottieData02 = dataPersonagem02 as unknown as LottieObject;

  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a valid Lottie JSON structure", () => {
    const result = createRandomChar(lottieData01);

    // Validate basic Lottie structure
    expect(result).toBeDefined();
    expect(result).toHaveProperty("v");
    expect(result).toHaveProperty("fr");
    expect(result).toHaveProperty("assets");
    expect(result).toHaveProperty("layers");
    expect(Array.isArray(result.assets)).toBe(true);
    expect(Array.isArray(result.layers)).toBe(true);

    // Validate result can be serialized/deserialized as JSON
    expect(() => JSON.parse(JSON.stringify(result))).not.toThrow();
  });

  it("should include all required parts", () => {
    const partTypes: CharPart[] = [
      "accessory",
      "head",
      "body",
      "front_arm",
      "back_arm",
      "front_leg",
      "back_leg",
    ];

    const result = createRandomChar(lottieData01);

    partTypes.forEach((part) => {
      const asset = (result.assets as LottieObject[]).find(
        (a) => (a as LottieObject)["nm"] === part
      );
      const layer = (result.layers as LottieObject[]).find(
        (l) => (l as LottieObject)["nm"] === part
      );

      expect(asset).toBeDefined();
      expect((asset as LottieObject)["nm"]).toBe(part);
      expect(asset).toHaveProperty("id");

      expect(layer).toBeDefined();
      expect((layer as LottieObject)["nm"]).toBe(part);
      expect(layer).toHaveProperty("ty");
    });
  });

  it("should not mutate the original character", () => {
    const originalAssets = JSON.parse(JSON.stringify(lottieData01.assets));
    const originalLayers = JSON.parse(JSON.stringify(lottieData01.layers));

    createRandomChar(lottieData01);

    expect(lottieData01.assets).toEqual(originalAssets);
    expect(lottieData01.layers).toEqual(originalLayers);
  });

  it("should work with data_personagem_02_correndo.json", () => {
    const result = createRandomChar(lottieData02);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("v");
    expect(result).toHaveProperty("fr");
    expect(result).toHaveProperty("assets");
    expect(result).toHaveProperty("layers");

    // Validate the head part exists
    const headAsset = (result.assets as LottieObject[]).find(
      (a) => (a as LottieObject)["nm"] === "head"
    );
    expect(headAsset).toBeDefined();
    expect((headAsset as LottieObject)["nm"]).toBe("head");

    // Validate result can be serialized/deserialized as JSON
    expect(() => JSON.parse(JSON.stringify(result))).not.toThrow();
  });

  it("should maintain the same number of assets and layers", () => {
    const originalAssetsCount = (lottieData01.assets as LottieObject[]).length;
    const originalLayersCount = (lottieData01.layers as LottieObject[]).length;

    const result = createRandomChar(lottieData01);

    expect((result.assets as LottieObject[]).length).toBe(originalAssetsCount);
    expect((result.layers as LottieObject[]).length).toBe(originalLayersCount);
  });

  it("should produce valid JSON that can be stringified and parsed", () => {
    const result = createRandomChar(lottieData01);

    const stringified = JSON.stringify(result);
    expect(stringified).toBeTruthy();
    expect(typeof stringified).toBe("string");

    const parsed = JSON.parse(stringified);
    expect(parsed).toBeDefined();
    expect(parsed).toHaveProperty("v");
    expect(parsed).toHaveProperty("assets");
    expect(parsed).toHaveProperty("layers");
  });

  it("should maintain Lottie version and frame rate", () => {
    const result = createRandomChar(lottieData01);

    expect(result.v).toBe(lottieData01.v);
    expect(result.fr).toBe(lottieData01.fr);
  });
});
