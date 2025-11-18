import { describe, it, expect } from "vitest";
import {
  updateColors,
  findFills,
  groupFillsByColor,
  colorsEqual,
  rgbToHex,
  hexToRgb,
} from "../utils";
import type { GroupedFillColor, LottieObject } from "../types";
import successfullyDoneJson from "../mock/successfully-done.json";
import dataJson from "../mock/data.json";

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

describe("updateColors with data.json - Multiple Objects Same Color", () => {
  it("should find multiple fills with the same skin color", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Find the skin color group (peach/tan color)
    const skinColorGroup = groups.find((group) =>
      colorsEqual(group.value, [0.87450986376, 0.619607843137, 0.509803921569])
    );

    expect(skinColorGroup).toBeDefined();
    // This color is used in multiple places (hands, arms, face, etc.)
    expect(skinColorGroup!.fills.length).toBeGreaterThan(1);
  });

  it("should update ALL fills when multiple objects share the same color", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Find the skin color group
    const skinColorGroup = groups.find((group) =>
      colorsEqual(group.value, [0.87450986376, 0.619607843137, 0.509803921569])
    );

    expect(skinColorGroup).toBeDefined();
    const originalFillCount = skinColorGroup!.fills.length;
    expect(originalFillCount).toBeGreaterThan(1);

    // Update to a new color (purple)
    const newColor = [0.5, 0.2, 0.8];
    const updatedData = updateColors(lottieData, skinColorGroup!, newColor);

    // Verify ALL fills were updated
    const updatedFills = findFills(updatedData);
    const purpleFills = updatedFills.filter((fill) =>
      colorsEqual(fill.value, newColor)
    );

    // All original fills should now be purple
    expect(purpleFills.length).toBe(originalFillCount);

    // Verify none of the old color remains
    const remainingSkinColorFills = updatedFills.filter((fill) =>
      colorsEqual(fill.value, [0.87450986376, 0.619607843137, 0.509803921569])
    );
    expect(remainingSkinColorFills.length).toBe(0);
  });

  it("should update ALL blue clothing fills", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Find the blue clothing color group
    const blueGroup = groups.find((group) =>
      colorsEqual(group.value, [0.439215716194, 0.552941176471, 0.85882358925])
    );

    expect(blueGroup).toBeDefined();
    const originalFillCount = blueGroup!.fills.length;
    expect(originalFillCount).toBeGreaterThan(1);

    // Update to red
    const newColor = [1, 0, 0];
    const updatedData = updateColors(lottieData, blueGroup!, newColor);

    // Verify ALL fills were updated
    const updatedFills = findFills(updatedData);
    const redFills = updatedFills.filter((fill) =>
      colorsEqual(fill.value, newColor)
    );

    expect(redFills.length).toBe(originalFillCount);

    // Verify none of the old blue color remains
    const remainingBlueFills = updatedFills.filter((fill) =>
      colorsEqual(fill.value, [0.439215716194, 0.552941176471, 0.85882358925])
    );
    expect(remainingBlueFills.length).toBe(0);
  });

  it("should handle nested assets with shared colors", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);

    // Group all fills by color
    const groups = groupFillsByColor(fills);

    // For each group with multiple fills, verify updateColors works correctly
    groups.forEach((group) => {
      if (group.fills.length > 1) {
        const originalCount = group.fills.length;
        const testColor = [0.123, 0.456, 0.789]; // Unique test color

        const updatedData = updateColors(lottieData, group, testColor);
        const updatedFills = findFills(updatedData);

        const updatedColorFills = updatedFills.filter((fill) =>
          colorsEqual(fill.value, testColor)
        );

        // All fills in the group should have been updated
        expect(updatedColorFills.length).toBeGreaterThanOrEqual(originalCount);
      }
    });
  });

  it("should preserve alpha channel when updating multiple fills", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Find a group with multiple fills that have alpha
    const groupWithAlpha = groups.find(
      (group) => group.fills.length > 1 && group.value.length === 4
    );

    if (groupWithAlpha) {
      const originalAlphaValues = groupWithAlpha.fills.map(
        (fill) => fill.value[3]
      );

      const newColor = [0.9, 0.1, 0.5];
      const updatedData = updateColors(lottieData, groupWithAlpha, newColor);

      const updatedFills = findFills(updatedData);

      // Find all the updated fills by their paths
      groupWithAlpha.fills.forEach((originalFill, index) => {
        const updatedFill = updatedFills.find(
          (fill) => fill.path.join(",") === originalFill.path.join(",")
        );

        expect(updatedFill).toBeDefined();
        expect(updatedFill!.value[0]).toBeCloseTo(0.9);
        expect(updatedFill!.value[1]).toBeCloseTo(0.1);
        expect(updatedFill!.value[2]).toBeCloseTo(0.5);
        // Alpha should be preserved
        expect(updatedFill!.value[3]).toBeCloseTo(originalAlphaValues[index]);
      });
    }
  });

  it("should correctly identify and count all shared colors in data.json", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    // Count groups with multiple fills (shared colors)
    const sharedColorGroups = groups.filter((group) => group.fills.length > 1);

    expect(sharedColorGroups.length).toBeGreaterThan(0);

    // Log for debugging purposes
    sharedColorGroups.forEach((group) => {
      console.log(
        `Color [${group.value
          .slice(0, 3)
          .map((v) => v.toFixed(2))
          .join(", ")}] is used by ${group.fills.length} fills`
      );
    });
  });

  it("should verify each fill in a group has a unique path", () => {
    const lottieData = dataJson as unknown as LottieObject;
    const fills = findFills(lottieData);
    const groups = groupFillsByColor(fills);

    groups.forEach((group) => {
      if (group.fills.length > 1) {
        const paths = group.fills.map((fill) => fill.path.join(","));
        const uniquePaths = new Set(paths);

        // Each fill should have a unique path
        expect(uniquePaths.size).toBe(group.fills.length);
      }
    });
  });

  it("should demonstrate the full update workflow", () => {
    const lottieData = dataJson as unknown as LottieObject;

    // Step 1: Find all fills
    const fills = findFills(lottieData);
    console.log(`\nTotal fills found: ${fills.length}`);

    // Step 2: Group by color
    const groups = groupFillsByColor(fills);
    console.log(`Total color groups: ${groups.length}`);

    // Step 3: Find the skin color group (most common)
    const skinColorGroup = groups.find((group) =>
      colorsEqual(group.value, [0.87450986376, 0.619607843137, 0.509803921569])
    );

    if (skinColorGroup) {
      console.log(
        `\nSkin color group has ${skinColorGroup.fills.length} fills`
      );
      console.log("Paths of all skin color fills:");
      skinColorGroup.fills.forEach((fill, index) => {
        console.log(`  ${index + 1}. ${fill.path.join(" -> ")}`);
        console.log(`     isNested: ${fill.isNested}`);
      });

      // Step 4: Update the color
      const newColor = [1, 0, 0]; // Red
      const updatedData = updateColors(lottieData, skinColorGroup, newColor);

      // Step 5: Verify ALL were updated
      const updatedFills = findFills(updatedData);
      const redFills = updatedFills.filter((fill) =>
        colorsEqual(fill.value, newColor)
      );

      console.log(`\nAfter update: ${redFills.length} fills are now red`);
      console.log(`Expected: ${skinColorGroup.fills.length} fills to be red`);

      expect(redFills.length).toBe(skinColorGroup.fills.length);
    }
  });
});
