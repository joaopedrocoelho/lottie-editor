import { useLottieData } from "../context/lottie-data-provider";
import { useCallback } from "react";

const ExportJson = () => {
  const { lottieData, groupedColors, fillColors } = useLottieData();

  // Export updated JSON
  const handleExport = useCallback(() => {
    if (!lottieData) return;

    // The lottieData is already updated by updateGroupColor, so just export it
    const dataStr = JSON.stringify(lottieData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lottie-edited.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [lottieData]);
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
