import { useLottieData } from "../context/lottie-data-provider";
import type { LottieObject, LottieValue } from "../types";
import { useCallback } from "react";

const ExportJson = () => {
  const { lottieData, groupedColors, fillColors } = useLottieData();

  // Export updated JSON
  const handleExport = useCallback(() => {
    if (!lottieData) return;

    // Apply all color changes to the data
    const updatedData = JSON.parse(JSON.stringify(lottieData)) as LottieObject;

    fillColors.forEach((fill) => {
      let target: LottieValue = updatedData;
      let found = true;

      for (let i = 0; i < fill.path.length; i++) {
        if (
          typeof target === "object" &&
          target !== null &&
          !Array.isArray(target)
        ) {
          target = (target as LottieObject)[fill.path[i]];
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
  return (
    <div className="controls-header">
      <h2>
        Fill Colors ({groupedColors.length} unique, {fillColors.length} total)
      </h2>
      <button onClick={handleExport} className="export-button">
        Export JSON
      </button>
    </div>
  );
};

export default ExportJson;
