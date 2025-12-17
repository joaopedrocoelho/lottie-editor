import { CHAR_PARTS, type CharPart } from "@/lib/createrandomchar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ManualCharCreatorProps {
  manualCharParts: Record<CharPart, number>;
  handleManualCharPartChange: (part: CharPart, value: string) => void;
  isLoading: boolean;
  handleGenerateManualChar: () => void;
}

const ManualCharCreator = ({
  manualCharParts,
  handleManualCharPartChange,
  isLoading,
  handleGenerateManualChar,
}: ManualCharCreatorProps) => {
  return (
    <div className="flex gap-x-2 items-end flex-wrap">
      {CHAR_PARTS.map((part) => (
        <div key={part} className="flex flex-col gap-1">
          <label className="text-xs text-gray-300 dark:text-gray-300 capitalize">
            {part.replace("_", " ")}
          </label>
          <Select
            value={(manualCharParts[part] + 1).toString()}
            onValueChange={(value) => handleManualCharPartChange(part, value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-16 h-9 text-sm bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((number) => (
                <SelectItem key={number} value={number.toString()}>
                  {number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <button
        type="button"
        onClick={handleGenerateManualChar}
        disabled={isLoading}
        className="upload-button w-fit disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating..." : "Generate Char"}
      </button>
    </div>
  );
};

export default ManualCharCreator;
