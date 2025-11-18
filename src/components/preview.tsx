import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useRef, useEffect } from "react";
import type { LottieObject } from "@/types";

const Preview = ({
  lottieData,
  animationKey,
}: {
  lottieData: LottieObject | null;
  animationKey: number;
}) => {
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
