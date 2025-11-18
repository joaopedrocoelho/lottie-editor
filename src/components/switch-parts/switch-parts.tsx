import { useSwitchParts } from "../../context/switch-parts-provider";
import SwitchPartsHeader from "./switch-parts-header";
import UploadJsons from "./upload-jsons";
import Preview from "../preview";

const SwitchParts = () => {
  const { lottieDataA, lottieDataB, animationKeyA, animationKeyB } =
    useSwitchParts();

  return (
    <div className="w-full h-full py-12">
      <SwitchPartsHeader />
      <UploadJsons />
      <div className="editor-container flex gap-x-4 text-white">
        <Preview lottieData={lottieDataA} animationKey={animationKeyA} />
        <Preview lottieData={lottieDataB} animationKey={animationKeyB} />
      </div>
    </div>
  );
};

export default SwitchParts;
