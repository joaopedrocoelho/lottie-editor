import { useLottieData } from "../../context/lottie-data-provider";
import ColorInput from "./color-input";

const GroupedColors = () => {
  const { lottieData, groupedColors } = useLottieData();

  return (
    <div className="color-pickers">
      {lottieData && groupedColors.length > 0 ? (
        groupedColors.map((group, index) => (
          <div key={index} className="color-picker-item">
            <ColorInput group={group} index={index} />
            <label>
              Color {index + 1}
              {group.fills.length > 1 && (
                <span className="count-badge">
                  ({group.fills.length} fills)
                </span>
              )}
            </label>

            <div className="rgb-values">
              RGB: ({Math.round(group.value[0] * 255)},{" "}
              {Math.round(group.value[1] * 255)},{" "}
              {Math.round(group.value[2] * 255)})
            </div>
            <div className="k-value">
              "k": [
              {group.originalValue
                .map((val) => (Number.isInteger(val) ? val : val.toFixed(11)))
                .join(", ")}
              ]
            </div>
          </div>
        ))
      ) : (
        <p className="no-fills">No fill colors found in this animation.</p>
      )}
    </div>
  );
};

export default GroupedColors;
