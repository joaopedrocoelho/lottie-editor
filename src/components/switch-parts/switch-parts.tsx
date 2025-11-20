import { useSwitchParts } from "../../context/switch-parts-provider";
import SwitchPartsHeader from "./switch-parts-header";
import UploadJsons from "./upload-jsons";
import Preview from "../preview";
import { CharParts } from "./char-parts";

const SwitchParts = () => {
  const { lottieDataA, lottieDataB, animationKeyA, animationKeyB } =
    useSwitchParts();

  return (
    <div className="w-full h-full py-12">
      <SwitchPartsHeader />
      <UploadJsons />
      <div className="editor-container flex gap-x-4 text-white">
        <div className="flex flex-col">
          <Preview lottieData={lottieDataA} animationKey={animationKeyA} />
          {lottieDataA && <CharParts lottieData={lottieDataA} />}
        </div>
        <div className="flex flex-col">
          <Preview lottieData={lottieDataB} animationKey={animationKeyB} />
          {lottieDataB && <CharParts lottieData={lottieDataB} />}
        </div>
      </div>
    </div>
  );
};

export default SwitchParts;
