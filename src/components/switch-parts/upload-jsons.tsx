import { useCallback, useState } from "react";
import { useSwitchParts } from "../../context/switch-parts-provider";

const UploadJsons = () => {
  const [errorA, setErrorA] = useState<string>("");
  const [errorB, setErrorB] = useState<string>("");
  const { setLottieDataA, setLottieDataB } = useSwitchParts();

  // Handle file upload for A
  const handleFileUploadA = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setErrorA("");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          setLottieDataA(json);
          console.log(`[Upload A] Lottie JSON loaded successfully`);
        } catch (err) {
          setErrorA(
            "Invalid JSON file. Please upload a valid Lottie JSON file."
          );
          console.error(err);
        }
      };
      reader.readAsText(file);
    },
    [setLottieDataA]
  );

  // Handle file upload for B
  const handleFileUploadB = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setErrorB("");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const json = JSON.parse(text);
          setLottieDataB(json);
          console.log(`[Upload B] Lottie JSON loaded successfully`);
        } catch (err) {
          setErrorB(
            "Invalid JSON file. Please upload a valid Lottie JSON file."
          );
          console.error(err);
        }
      };
      reader.readAsText(file);
    },
    [setLottieDataB]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="upload-section">
        <label htmlFor="file-upload-a" className="upload-button">
          Upload Lottie JSON File A
        </label>
        <input
          id="file-upload-a"
          type="file"
          accept=".json"
          onChange={handleFileUploadA}
          style={{ display: "none" }}
        />
      </div>
      {errorA && <div className="error-message">{errorA}</div>}

      <div className="upload-section">
        <label htmlFor="file-upload-b" className="upload-button">
          Upload Lottie JSON File B
        </label>
        <input
          id="file-upload-b"
          type="file"
          accept=".json"
          onChange={handleFileUploadB}
          style={{ display: "none" }}
        />
      </div>
      {errorB && <div className="error-message">{errorB}</div>}
    </div>
  );
};

export default UploadJsons;
