import Header from "./header";
import UploadJson from "./upload-json";
import Preview from "../preview";
import ExportJson from "./export-json";
import GroupedColors from "./grouped-colors";
import { useLottieData } from "../../context/lottie-data-provider";

const ChangeColors = () => {
  const { lottieData, animationKey } = useLottieData();
  return (
    <div className="w-full h-full py-12">
      <Header />
      <UploadJson />

      <div className="editor-container">
        <Preview lottieData={lottieData} animationKey={animationKey} />
        <div className="controls-section">
          <ExportJson />
          <GroupedColors />
        </div>
      </div>
    </div>
  );
};

export default ChangeColors;
