import { useLottieData } from "../context/lottie-data-provider";
import { hexToRgb, rgbToHex } from "../utils";
import { useCallback, useState } from "react";
import type { GroupedFillColor } from "../types";

const ColorInput = ({
  group,
  index,
}: {
  group: GroupedFillColor;
  index: number;
}) => {
  const { updateGroupColor } = useLottieData();
  const [tempColor, setTempColor] = useState<string>(rgbToHex(group.value));
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Handle color change from color picker or text input (only updates local state)
  const handleTempColorChange = useCallback((hexColor: string) => {
    setTempColor(hexColor);
  }, []);

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    const rgb = hexToRgb(tempColor);
    updateGroupColor(index, rgb);
    setIsEditing(false);
  }, [tempColor, index, updateGroupColor]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    setTempColor(rgbToHex(group.value));
    setIsEditing(false);
  }, [group.value]);

  return (
    <div className="color-input-group">
      <input
        type="color"
        value={tempColor}
        onChange={(e) => {
          handleTempColorChange(e.target.value);
          setIsEditing(true);
        }}
        className="color-picker"
      />
      <input
        type="text"
        value={tempColor}
        onChange={(e) => {
          handleTempColorChange(e.target.value);
          setIsEditing(true);
        }}
        className="color-hex"
        placeholder="#000000"
      />
      {isEditing && (
        <div className="color-actions">
          <button onClick={handleConfirm} className="confirm-button">
            Confirm
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ColorInput;
