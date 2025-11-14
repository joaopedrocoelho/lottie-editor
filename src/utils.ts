import type {
  FillColor,
  GroupedFillColor,
  LottieObject,
  LottieValue,
} from "./types";

// Recursively find all "ty": "fl" entries in the JSON
export function findFills(obj: LottieValue, path: string[] = []): FillColor[] {
  const fills: FillColor[] = [];

  if (typeof obj !== "object" || obj === null) {
    return fills;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      fills.push(...findFills(item, [...path, index.toString()]));
    });
    return fills;
  }

  const lottieObj = obj as LottieObject;

  // Check if this is a fill object
  if (lottieObj.ty === "fl" && lottieObj.c) {
    let colorArray: number[] | null = null;
    let isNested = false;

    // Check if color is directly in c as an array
    if (Array.isArray(lottieObj.c)) {
      colorArray = lottieObj.c as number[];
      isNested = false;
    }
    // Check if color is in c.k (nested structure)
    else if (
      typeof lottieObj.c === "object" &&
      lottieObj.c !== null &&
      !Array.isArray(lottieObj.c) &&
      "k" in lottieObj.c &&
      Array.isArray((lottieObj.c as LottieObject).k)
    ) {
      colorArray = (lottieObj.c as LottieObject).k as number[];
      isNested = true;
    }

    if (colorArray && colorArray.length >= 3) {
      fills.push({
        path: [...path],
        value: [...colorArray],
        originalValue: [...colorArray],
        isNested,
      });
    }
  }

  // Recursively search in all properties
  for (const key in lottieObj) {
    if (Object.prototype.hasOwnProperty.call(lottieObj, key)) {
      const newPath = [...path, key];
      fills.push(...findFills(lottieObj[key], newPath));
    }
  }

  return fills;
}

// Compare two color arrays (RGB only, ignoring alpha)
export function colorsEqual(color1: number[], color2: number[]): boolean {
  if (color1.length < 3 || color2.length < 3) return false;
  // Compare RGB values with small tolerance for floating point precision
  const tolerance = 0.0001;
  return (
    Math.abs(color1[0] - color2[0]) < tolerance &&
    Math.abs(color1[1] - color2[1]) < tolerance &&
    Math.abs(color1[2] - color2[2]) < tolerance
  );
}

// Group fills by their color value
export function groupFillsByColor(fills: FillColor[]): GroupedFillColor[] {
  const groups: GroupedFillColor[] = [];

  fills.forEach((fill) => {
    // Find existing group with same color
    const existingGroup = groups.find((group) =>
      colorsEqual(group.value, fill.value)
    );

    if (existingGroup) {
      existingGroup.fills.push(fill);
    } else {
      groups.push({
        value: [...fill.value],
        originalValue: [...fill.originalValue],
        fills: [fill],
      });
    }
  });

  return groups;
}

// Convert RGB array [r, g, b] to hex
export const rgbToHex = (rgb: number[]): string => {
  const r = Math.round(rgb[0] * 255);
  const g = Math.round(rgb[1] * 255);
  const b = Math.round(rgb[2] * 255);
  return `#${[r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("")}`;
};

// Convert hex to RGB array [r, g, b] (0-1 range)
export const hexToRgb = (hex: string): number[] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

export const updateColors = (
  prev: LottieObject,
  group: GroupedFillColor,
  newColor: number[]
) => {
  const newData = JSON.parse(JSON.stringify(prev)) as LottieObject;

  group.fills.forEach((fill) => {
    let target: LottieValue = newData;
    let found = true;

    for (let i = 0; i < fill.path.length; i++) {
      if (typeof target === "object" && target !== null) {
        if (Array.isArray(target)) {
          target = target[parseInt(fill.path[i])];
        } else {
          target = (target as LottieObject)[fill.path[i]];
        }
      } else {
        found = false;
        break;
      }
    }

    if (
      found &&
      typeof target === "object" &&
      target !== null &&
      !Array.isArray(target) &&
      (target as LottieObject).ty === "fl"
    ) {
      const targetObj = target as LottieObject;
      // Preserve alpha channel if it exists
      const newColorWithAlpha =
        fill.value.length === 4 ? [...newColor, fill.value[3]] : newColor;

      if (fill.isNested) {
        // Update nested structure: c.k
        if (
          targetObj.c &&
          typeof targetObj.c === "object" &&
          targetObj.c !== null &&
          !Array.isArray(targetObj.c)
        ) {
          (targetObj.c as LottieObject).k = newColorWithAlpha;
        }
      } else {
        // Update direct structure: c
        targetObj.c = newColorWithAlpha;
      }
    }
  });

  return newData;
};
