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

  // Skip pre-composition layers (ty: 0) to avoid counting fills twice
  // Pre-comps reference compositions defined in assets, so we only want to count
  // fills in the asset definitions, not in the references
  if (lottieObj.ty === 0 && lottieObj.refId) {
    console.log(
      `[findFills] Skipping pre-comp layer with refId: ${lottieObj.refId}`
    );
    return fills;
  }

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
      const fill = {
        path: [...path],
        value: [...colorArray],
        originalValue: [...colorArray],
        isNested,
      };
      fills.push(fill);
      // Log skin color fills specifically
      if (
        Math.abs(colorArray[0] - 0.87450986376) < 0.0001 &&
        Math.abs(colorArray[1] - 0.619607843137) < 0.0001
      ) {
        console.log(
          `[findFills] Found skin color fill at path: ${path.join(" -> ")}`
        );
      }
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

export const updateColor = (
  prev: LottieObject,
  oldColor: number[],
  newColor: number[]
) => {
  const newData = JSON.parse(JSON.stringify(prev)) as LottieObject;

  // Recursive function to traverse and update colors
  const updateColorRecursive = (obj: LottieValue): void => {
    if (typeof obj !== "object" || obj === null) {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item) => updateColorRecursive(item));
      return;
    }

    const lottieObj = obj as LottieObject;

    // Check if this is a fill object with a color
    if (lottieObj.ty === "fl" && lottieObj.c) {
      // Check if color is directly in c as an array
      if (Array.isArray(lottieObj.c)) {
        const colorArray = lottieObj.c as number[];
        if (colorsEqual(colorArray, oldColor)) {
          // Update RGB values, preserve alpha if it exists
          colorArray[0] = newColor[0];
          colorArray[1] = newColor[1];
          colorArray[2] = newColor[2];
          // If newColor has alpha and old color has alpha, update it
          if (newColor.length > 3 && colorArray.length > 3) {
            colorArray[3] = newColor[3];
          }
        }
      }
      // Check if color is in c.k (nested structure)
      else if (
        typeof lottieObj.c === "object" &&
        lottieObj.c !== null &&
        !Array.isArray(lottieObj.c) &&
        "k" in lottieObj.c
      ) {
        const cObj = lottieObj.c as LottieObject;
        if (Array.isArray(cObj.k)) {
          const colorArray = cObj.k as number[];
          if (colorsEqual(colorArray, oldColor)) {
            // Update RGB values, preserve alpha if it exists
            colorArray[0] = newColor[0];
            colorArray[1] = newColor[1];
            colorArray[2] = newColor[2];
            // If newColor has alpha and old color has alpha, update it
            if (newColor.length > 3 && colorArray.length > 3) {
              colorArray[3] = newColor[3];
            }
          }
        }
      }
    }

    // Recursively search in all properties
    for (const key in lottieObj) {
      if (Object.prototype.hasOwnProperty.call(lottieObj, key)) {
        updateColorRecursive(lottieObj[key]);
      }
    }
  };

  updateColorRecursive(newData);
  return newData;
};
