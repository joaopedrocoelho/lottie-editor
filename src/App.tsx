import { useState, useCallback } from "react";
import Lottie from "lottie-react";
import "./App.css";

interface FillColor {
  path: string[];
  value: number[];
  originalValue: number[];
  isNested: boolean; // true if color is in c.k, false if directly in c
}

type LottieValue =
  | string
  | number
  | boolean
  | null
  | LottieObject
  | LottieArray;
type LottieObject = { [key: string]: LottieValue };
type LottieArray = LottieValue[];

// Recursively find all "ty": "fl" entries in the JSON
function findFills(obj: LottieValue, path: string[] = []): FillColor[] {
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

function App() {
  const [lottieData, setLottieData] = useState<LottieObject | null>(null);
  const [fillColors, setFillColors] = useState<FillColor[]>([]);
  const [error, setError] = useState<string>("");

  // Update a specific fill color in the JSON
  const updateFillColor = useCallback(
    (index: number, newColor: number[]) => {
      setFillColors((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], value: newColor };
        return updated;
      });

      // Update the actual lottie data
      setLottieData((prev) => {
        if (!prev) return prev;
        const newData = JSON.parse(JSON.stringify(prev)) as LottieObject;
        const fill = fillColors[index];
        if (fill) {
          let target: LottieValue = newData;
          for (let i = 0; i < fill.path.length; i++) {
            if (
              typeof target === "object" &&
              target !== null &&
              !Array.isArray(target)
            ) {
              target = (target as LottieObject)[fill.path[i]];
            } else {
              return newData;
            }
          }
          if (
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
        }
        return newData;
      });
    },
    [fillColors]
  );

  // Convert RGB array [r, g, b] to hex
  const rgbToHex = useCallback((rgb: number[]): string => {
    const r = Math.round(rgb[0] * 255);
    const g = Math.round(rgb[1] * 255);
    const b = Math.round(rgb[2] * 255);
    return `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;
  }, []);

  // Convert hex to RGB array [r, g, b] (0-1 range)
  const hexToRgb = useCallback((hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError("");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          setLottieData(json);
          const fills = findFills(json);
          setFillColors(fills);
          if (fills.length === 0) {
            setError("No fill colors found in this Lottie file.");
          }
        } catch (err) {
          setError(
            "Invalid JSON file. Please upload a valid Lottie JSON file."
          );
          console.error(err);
        }
      };
      reader.readAsText(file);
    },
    []
  );

  // Export updated JSON
  const handleExport = useCallback(() => {
    if (!lottieData) return;

    // Apply all color changes to the data
    const updatedData = JSON.parse(JSON.stringify(lottieData)) as LottieObject;

    fillColors.forEach((fill) => {
      let target: LottieValue = updatedData;
      for (let i = 0; i < fill.path.length; i++) {
        if (
          typeof target === "object" &&
          target !== null &&
          !Array.isArray(target)
        ) {
          target = (target as LottieObject)[fill.path[i]];
        } else {
          return;
        }
      }
      if (
        typeof target === "object" &&
        target !== null &&
        !Array.isArray(target) &&
        (target as LottieObject).ty === "fl"
      ) {
        const targetObj = target as LottieObject;
        // Preserve alpha channel if it exists
        const colorWithAlpha =
          fill.value.length === 4
            ? fill.value
            : fill.value.length === 3
            ? [...fill.value, 1]
            : fill.value;

        if (fill.isNested) {
          // Update nested structure: c.k
          if (
            targetObj.c &&
            typeof targetObj.c === "object" &&
            targetObj.c !== null &&
            !Array.isArray(targetObj.c)
          ) {
            (targetObj.c as LottieObject).k = colorWithAlpha;
          }
        } else {
          // Update direct structure: c
          targetObj.c = colorWithAlpha;
        }
      }
    });

    const dataStr = JSON.stringify(updatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lottie-edited.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [lottieData, fillColors]);

  // Handle color change from color picker
  const handleColorChange = useCallback(
    (index: number, hexColor: string) => {
      const rgb = hexToRgb(hexColor);
      updateFillColor(index, rgb);
    },
    [hexToRgb, updateFillColor]
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Lottie Color Editor</h1>
        <p>Upload a Lottie JSON file to edit fill colors</p>
      </header>

      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-button">
          Upload Lottie JSON File
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {lottieData && (
        <div className="editor-container">
          <div className="preview-section">
            <h2>Preview</h2>
            <div className="lottie-container">
              <Lottie animationData={lottieData} loop={true} />
            </div>
          </div>

          <div className="controls-section">
            <div className="controls-header">
              <h2>Fill Colors ({fillColors.length})</h2>
              <button onClick={handleExport} className="export-button">
                Export JSON
              </button>
            </div>

            {fillColors.length > 0 ? (
              <div className="color-pickers">
                {fillColors.map((fill, index) => (
                  <div key={index} className="color-picker-item">
                    <label>
                      Fill {index + 1}
                      <span className="path-info">
                        {fill.path.slice(-3).join(" → ")}
                      </span>
                    </label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={rgbToHex(fill.value)}
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={rgbToHex(fill.value)}
                        onChange={(e) =>
                          handleColorChange(index, e.target.value)
                        }
                        className="color-hex"
                        placeholder="#000000"
                      />
                    </div>
                    <div className="rgb-values">
                      RGB: ({Math.round(fill.value[0] * 255)},{" "}
                      {Math.round(fill.value[1] * 255)},{" "}
                      {Math.round(fill.value[2] * 255)})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-fills">
                No fill colors found in this animation.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
