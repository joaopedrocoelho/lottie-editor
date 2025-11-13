import Lottie from "lottie-react";
import type { LottieObject } from "../types";

interface PreviewProps {
  animationKey: number;
  lottieData: LottieObject;
}

const Preview = ({ animationKey, lottieData }: PreviewProps) => {
  return (
    <div className="preview-section">
      <h2>Preview</h2>
      <div className="lottie-container">
        <Lottie key={animationKey} animationData={lottieData} loop={true} />
      </div>
    </div>
  );
};

export default Preview;
