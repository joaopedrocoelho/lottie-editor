import { describe, it, expect } from "vitest";
import {
  updateColors,
  findFills,
  groupFillsByColor,
  colorsEqual,
  rgbToHex,
  hexToRgb,
} from "./utils";
import type { GroupedFillColor, LottieObject } from "./types";
import successfullyDoneJson from "./mock/successfully-done.json";

describe("updateColors", () => {
  it("should update nested color structure (c.k)", () => {
    const lottieData = successfullyDoneJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Find the green fill color group
    const greenGroup = groups.find((group) =>
      colorsEqual(group.value, [0.302594981474, 0.935661944221, 0.190141999488])
    );

    expect(greenGroup).toBeDefined();

    // Update to red color
    const newColor = [1, 0, 0]; // Red
    const updatedData = updateColors(lottieData, greenGroup!, newColor);

    // Verify the color was updated
    const updatedFills = findFills(updatedData);
    const redFill = updatedFills.find((fill) =>
      colorsEqual(fill.value, newColor)
    );

    expect(redFill).toBeDefined();
    expect(redFill!.value[0]).toBeCloseTo(1);
    expect(redFill!.value[1]).toBeCloseTo(0);
    expect(redFill!.value[2]).toBeCloseTo(0);
  });

  it("should preserve alpha channel when updating color", () => {
    const lottieData = successfullyDoneJson as unknown as LottieObject;
    const fills = findFills(lottieData);

    // Find a fill with alpha channel
    const fillWithAlpha = fills.find((fill) => fill.value.length === 4);
    expect(fillWithAlpha).toBeDefined();

    const originalAlpha = fillWithAlpha!.value[3];

    const group: GroupedFillColor = {
      value: fillWithAlpha!.value,
      originalValue: fillWithAlpha!.originalValue,
      fills: [fillWithAlpha!],
    };

    // Update color
    const newColor = [0.5, 0.5, 0.5]; // Gray
    const updatedData = updateColors(lottieData, group, newColor);

    // Verify alpha is preserved
    const updatedFills = findFills(updatedData);
    const updatedFill = updatedFills.find(
      (fill) => fill.path.join(",") === fillWithAlpha!.path.join(",")
    );

    expect(updatedFill).toBeDefined();
    expect(updatedFill!.value.length).toBe(4);
    expect(updatedFill!.value[3]).toBeCloseTo(originalAlpha);
    expect(updatedFill!.value[0]).toBeCloseTo(0.5);
    expect(updatedFill!.value[1]).toBeCloseTo(0.5);
    expect(updatedFill!.value[2]).toBeCloseTo(0.5);
  });

  it("should not mutate the original object", () => {
    const lottieData = JSON.parse(
      JSON.stringify(successfullyDoneJson)
    ) as LottieObject;
    const originalJson = JSON.stringify(lottieData);

    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    if (groups.length > 0) {
      const newColor = [0.1, 0.2, 0.3];
      updateColors(lottieData, groups[0], newColor);

      // Original should remain unchanged
      expect(JSON.stringify(lottieData)).toBe(originalJson);
    }
  });

  it("should update multiple fills with the same color", () => {
    // Create a test object with multiple fills of the same color
    const testData: LottieObject = {
      layers: [
        {
          shapes: [
            {
              ty: "fl",
              c: { a: 0, k: [1, 0, 0, 1], ix: 4 },
            },
          ],
        },
        {
          shapes: [
            {
              ty: "fl",
              c: { a: 0, k: [1, 0, 0, 1], ix: 4 },
            },
          ],
        },
      ],
    };

    const fills = findFills(testData);
    const groups = groupFillsByColor(fills);

    expect(groups.length).toBe(1);
    expect(groups[0].fills.length).toBe(2);

    const newColor = [0, 1, 0]; // Green
    const updatedData = updateColors(testData, groups[0], newColor);

    const updatedFills = findFills(updatedData);
    const greenFills = updatedFills.filter((fill) =>
      colorsEqual(fill.value, newColor)
    );

    expect(greenFills.length).toBe(2);
  });

  it("should handle color updates without alpha channel", () => {
    const testData: LottieObject = {
      layers: [
        {
          shapes: [
            {
              ty: "fl",
              c: { a: 0, k: [1, 0, 0], ix: 4 },
            },
          ],
        },
      ],
    };

    const fills = findFills(testData);
    const group: GroupedFillColor = {
      value: [1, 0, 0],
      originalValue: [1, 0, 0],
      fills: fills,
    };

    const newColor = [0, 0, 1]; // Blue
    const updatedData = updateColors(testData, group, newColor);

    const updatedFills = findFills(updatedData);
    expect(updatedFills[0].value).toEqual(newColor);
  });

  it("should handle direct color structure (non-nested)", () => {
    const testData: LottieObject = {
      layers: [
        {
          shapes: [
            {
              ty: "fl",
              c: [1, 0, 0, 1], // Direct array, not nested in k
            },
          ],
        },
      ],
    };

    const fills = findFills(testData);
    const group: GroupedFillColor = {
      value: [1, 0, 0, 1],
      originalValue: [1, 0, 0, 1],
      fills: fills,
    };

    const newColor = [0, 1, 1]; // Cyan
    const updatedData = updateColors(testData, group, newColor);

    const updatedFills = findFills(updatedData);
    expect(updatedFills[0].value[0]).toBeCloseTo(0);
    expect(updatedFills[0].value[1]).toBeCloseTo(1);
    expect(updatedFills[0].value[2]).toBeCloseTo(1);
    expect(updatedFills[0].value[3]).toBeCloseTo(1); // Alpha preserved
  });

  it("should handle empty fills array gracefully", () => {
    const testData: LottieObject = {
      layers: [],
    };

    const group: GroupedFillColor = {
      value: [1, 0, 0],
      originalValue: [1, 0, 0],
      fills: [],
    };

    const newColor = [0, 1, 0];
    const updatedData = updateColors(testData, group, newColor);

    expect(updatedData).toEqual(testData);
  });

  it("should return a new object reference", () => {
    const lottieData = successfullyDoneJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    if (groups.length > 0) {
      const newColor = [0.1, 0.2, 0.3];
      const updatedData = updateColors(lottieData, groups[0], newColor);

      expect(updatedData).not.toBe(lottieData);
    }
  });
});

describe("colorsEqual", () => {
  it("should return true for equal RGB colors", () => {
    expect(colorsEqual([1, 0, 0], [1, 0, 0])).toBe(true);
    expect(colorsEqual([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])).toBe(true);
  });

  it("should return true for colors with different alpha values", () => {
    expect(colorsEqual([1, 0, 0, 1], [1, 0, 0, 0.5])).toBe(true);
  });

  it("should return false for different RGB colors", () => {
    expect(colorsEqual([1, 0, 0], [0, 1, 0])).toBe(false);
    expect(colorsEqual([0.5, 0.5, 0.5], [0.6, 0.5, 0.5])).toBe(false);
  });

  it("should handle floating point precision", () => {
    expect(colorsEqual([0.1 + 0.2, 0, 0], [0.3, 0, 0])).toBe(true);
  });

  it("should return false for arrays with less than 3 elements", () => {
    expect(colorsEqual([1, 0], [1, 0])).toBe(false);
    expect(colorsEqual([], [])).toBe(false);
  });
});

describe("rgbToHex", () => {
  it("should convert RGB to hex correctly", () => {
    expect(rgbToHex([1, 0, 0])).toBe("#ff0000");
    expect(rgbToHex([0, 1, 0])).toBe("#00ff00");
    expect(rgbToHex([0, 0, 1])).toBe("#0000ff");
    expect(rgbToHex([1, 1, 1])).toBe("#ffffff");
    expect(rgbToHex([0, 0, 0])).toBe("#000000");
  });

  it("should handle mid-range values", () => {
    expect(rgbToHex([0.5, 0.5, 0.5])).toBe("#808080");
  });

  it("should pad single digit hex values", () => {
    expect(rgbToHex([0.02, 0.02, 0.02])).toBe("#050505");
  });
});

describe("hexToRgb", () => {
  it("should convert hex to RGB correctly", () => {
    expect(hexToRgb("#ff0000")).toEqual([1, 0, 0]);
    expect(hexToRgb("#00ff00")).toEqual([0, 1, 0]);
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 1]);
    expect(hexToRgb("#ffffff")).toEqual([1, 1, 1]);
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
  });

  it("should handle hex without # prefix", () => {
    expect(hexToRgb("ff0000")).toEqual([1, 0, 0]);
  });

  it("should handle uppercase hex", () => {
    expect(hexToRgb("#FF0000")).toEqual([1, 0, 0]);
  });

  it("should return [0, 0, 0] for invalid hex", () => {
    expect(hexToRgb("invalid")).toEqual([0, 0, 0]);
    expect(hexToRgb("#gg0000")).toEqual([0, 0, 0]);
  });

  it("should be inverse of rgbToHex", () => {
    const rgb = [0.5, 0.25, 0.75];
    const hex = rgbToHex(rgb);
    const backToRgb = hexToRgb(hex);

    expect(backToRgb[0]).toBeCloseTo(rgb[0], 2);
    expect(backToRgb[1]).toBeCloseTo(rgb[1], 2);
    expect(backToRgb[2]).toBeCloseTo(rgb[2], 2);
  });
});

describe("findFills", () => {
  it("should find fills in successfully-done.json", () => {
    const fills = findFills(successfullyDoneJson as unknown as LottieObject);

    expect(fills.length).toBeGreaterThan(0);

    // Check that all found fills have the expected structure
    fills.forEach((fill) => {
      expect(fill.path).toBeDefined();
      expect(Array.isArray(fill.path)).toBe(true);
      expect(fill.value).toBeDefined();
      expect(Array.isArray(fill.value)).toBe(true);
      expect(fill.value.length).toBeGreaterThanOrEqual(3);
      expect(typeof fill.isNested).toBe("boolean");
    });
  });

  it("should identify nested vs direct color structures", () => {
    const testDataNested: LottieObject = {
      layers: [
        {
          shapes: [
            {
              ty: "fl",
              c: { a: 0, k: [1, 0, 0, 1], ix: 4 },
            },
          ],
        },
      ],
    };

    const testDataDirect: LottieObject = {
      layers: [
        {
          shapes: [
            {
              ty: "fl",
              c: [1, 0, 0, 1],
            },
          ],
        },
      ],
    };

    const nestedFills = findFills(testDataNested);
    const directFills = findFills(testDataDirect);

    expect(nestedFills[0].isNested).toBe(true);
    expect(directFills[0].isNested).toBe(false);
  });

  it("should handle empty objects", () => {
    const fills = findFills({});
    expect(fills).toEqual([]);
  });

  it("should handle null values", () => {
    const fills = findFills(null);
    expect(fills).toEqual([]);
  });
});

describe("groupFillsByColor", () => {
  it("should group fills with the same color", () => {
    const fills = findFills(successfullyDoneJson as unknown as LottieObject);
    const groups = groupFillsByColor(fills);

    expect(groups.length).toBeGreaterThan(0);

    // Each group should have at least one fill
    groups.forEach((group) => {
      expect(group.fills.length).toBeGreaterThan(0);
      expect(Array.isArray(group.value)).toBe(true);
      expect(Array.isArray(group.originalValue)).toBe(true);
    });

    // All fills in a group should have the same color
    groups.forEach((group) => {
      const firstColor = group.fills[0].value;
      group.fills.forEach((fill) => {
        expect(colorsEqual(fill.value, firstColor)).toBe(true);
      });
    });
  });

  it("should create separate groups for different colors", () => {
    const fills = [
      {
        path: ["a"],
        value: [1, 0, 0],
        originalValue: [1, 0, 0],
        isNested: false,
      },
      {
        path: ["b"],
        value: [0, 1, 0],
        originalValue: [0, 1, 0],
        isNested: false,
      },
      {
        path: ["c"],
        value: [1, 0, 0],
        originalValue: [1, 0, 0],
        isNested: false,
      },
    ];

    const groups = groupFillsByColor(fills);

    expect(groups.length).toBe(2);
    expect(groups[0].fills.length).toBe(2); // Two red fills
    expect(groups[1].fills.length).toBe(1); // One green fill
  });

  it("should handle empty fills array", () => {
    const groups = groupFillsByColor([]);
    expect(groups).toEqual([]);
  });
});
