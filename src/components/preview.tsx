import Lottie from "lottie-react";
import { useLottieData } from "../context/lottie-data-provider";

const Preview = () => {
  const { lottieData, animationKey } = useLottieData();
  return (
    <div className="preview-section">
      <h2>Preview</h2>
      <div className="lottie-container">
        {lottieData ? (
          <Lottie key={animationKey} animationData={lottieData} loop={true} />
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
