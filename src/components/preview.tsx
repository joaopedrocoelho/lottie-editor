import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useLottieData } from "../context/lottie-data-provider";
import { useRef, useEffect } from "react";

const Preview = () => {
  const { lottieData, animationKey } = useLottieData();
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {}, [lottieData]);

  return (
    <div className="preview-section">
      <h2>Preview</h2>
      <div className="lottie-container">
        {lottieData ? (
          <Lottie
            key={animationKey}
            animationData={lottieData}
            loop={true}
            lottieRef={lottieRef}
          />
        ) : (
          <p
            className="no-fills"
            style={{ textAlign: "center", color: "black" }}
          >
            No Lottie data found. Please upload a Lottie JSON file.
          </p>
        )}
      </div>
    </div>
  );
};

export default Preview;
