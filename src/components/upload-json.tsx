import { useCallback, useState } from "react";
import { findFills, groupFillsByColor } from "../utils";
import { useLottieData } from "../context/lottie-data-provider";

const UploadJson = () => {
  const [error, setError] = useState<string>("");
  const { setLottieData, setFillColors, setGroupedColors } = useLottieData();
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
          const grouped = groupFillsByColor(fills);
          setGroupedColors(grouped);
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
    [setLottieData, setFillColors, setGroupedColors]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
    </div>
  );
};

export default UploadJson;
