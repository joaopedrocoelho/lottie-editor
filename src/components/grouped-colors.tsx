import { useCallback } from "react";
import { useLottieData } from "../context/lottie-data-provider";
import { hexToRgb, rgbToHex } from "../utils";

const GroupedColors = () => {
  const { lottieData, groupedColors, updateGroupColor } = useLottieData();

  // Handle color change from color picker
  const handleColorChange = useCallback(
    (groupIndex: number, hexColor: string) => {
      const rgb = hexToRgb(hexColor);
      updateGroupColor(groupIndex, rgb);
    },
    [updateGroupColor]
  );

  return (
    <div className="color-pickers">
      {lottieData && groupedColors.length > 0 ? (
        groupedColors.map((group, index) => (
          <div key={index} className="color-picker-item">
            <label>
              Color {index + 1}
              {group.fills.length > 1 && (
                <span className="count-badge">
                  ({group.fills.length} fills)
                </span>
              )}
            </label>
            <div className="color-input-group">
              <input
                type="color"
                value={rgbToHex(group.value)}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="color-picker"
              />
              <input
                type="text"
                value={rgbToHex(group.value)}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="color-hex"
                placeholder="#000000"
              />
            </div>
            <div className="rgb-values">
              RGB: ({Math.round(group.value[0] * 255)},{" "}
              {Math.round(group.value[1] * 255)},{" "}
              {Math.round(group.value[2] * 255)})
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
