import { useState } from "react";
import type { LottieObject } from "@/types";
import { generateCharJson, generateRandomChar } from "./utils";
import Preview from "../preview";

const CreateRandomChar = () => {
  const [char, setChar] = useState<LottieObject>();
  const [key, setKey] = useState<number>(0);

  return (
    <div className="flex flex-col gap-y-4 pt-12">
      <button
        type="button"
        onClick={() => {
          const randomChar = generateRandomChar();
          const charJson = generateCharJson(randomChar);
          setChar(charJson);
          setKey((prev) => prev + 1);
        }}
        className="upload-button w-fit"
      >
        Generate Random Char
      </button>

      {char && <Preview lottieData={char} animationKey={key} />}
    </div>
  );
};

export default CreateRandomChar;
