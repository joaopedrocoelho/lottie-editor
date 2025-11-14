import { useLottieData } from "../context/lottie-data-provider";
import { hexToRgb, rgbToHex } from "../utils";
import { useCallback, useState } from "react";
import type { GroupedFillColor } from "../types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  ColorPicker,
  ColorPickerSelection,
  ColorPickerHue,
  ColorPickerAlpha,
  ColorPickerFormat,
} from "./ui/shadcn-io/color-picker";

const ColorInput = ({
  group,
  index,
}: {
  group: GroupedFillColor;
  index: number;
}) => {
  const { updateGroupColor } = useLottieData();
  const [tempColor, setTempColor] = useState<string>(rgbToHex(group.value));
  const [previewColor, setPreviewColor] = useState<string>(
    rgbToHex(group.value)
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  // Handle color change from color picker or text input (only updates local state)
  const handleTempColorChange = useCallback((hexColor: string) => {
    setTempColor(hexColor);
    setPreviewColor(hexColor);
    setIsEditing(true);
  }, []);

  // Handle color change from shadcn ColorPicker (only updates preview, not tempColor)
  const handleColorPickerChange = useCallback(
    (rgba: [number, number, number, number]) => {
      // Convert from 0-255 range to 0-1 range for Lottie
      const lottieRgb = [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255];
      // Update preview color hex for display in picker only
      setPreviewColor(rgbToHex(lottieRgb));
      setIsEditing(true);
    },
    []
  );

  // Handle popover open - sync preview color with current temp color
  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      setIsPopoverOpen(open);
      if (open) {
        // When opening, sync preview with current temp color
        setPreviewColor(tempColor);
      } else {
        // When closing without confirm, reset preview
        setPreviewColor(tempColor);
      }
    },
    [tempColor]
  );

  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    const rgb = hexToRgb(previewColor);
    updateGroupColor(index, rgb);
    setTempColor(previewColor);
    setIsEditing(false);
    setIsPopoverOpen(false);
  }, [previewColor, index, updateGroupColor]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    const originalColor = rgbToHex(group.value);
    setTempColor(originalColor);
    setPreviewColor(originalColor);
    setIsEditing(false);
    setIsPopoverOpen(false);
  }, [group.value]);

  return (
    <div className="color-input-group">
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <input
            type="color"
            value={tempColor}
            onChange={(e) => {
              handleTempColorChange(e.target.value);
              setIsEditing(true);
            }}
            className="color-picker"
            onClick={(e) => {
              e.preventDefault();
              setIsPopoverOpen(true);
            }}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                border: "none",
                background: "transparent",
              }}
              aria-label="Open color picker"
            />
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-4 bg-black">
          <ColorPicker
            value={previewColor}
            onChange={handleColorPickerChange}
            className="w-full"
          >
            <div className="flex flex-col gap-3">
              <ColorPickerSelection className="h-32 w-full" />
              <ColorPickerHue />
              <ColorPickerAlpha />
              <ColorPickerFormat />
            </div>
          </ColorPicker>
          <div className="color-actions mt-4 flex gap-2">
            <button onClick={handleConfirm} className="confirm-button">
              Confirm
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        </PopoverContent>
      </Popover>
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
      {isEditing && !isPopoverOpen && (
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
