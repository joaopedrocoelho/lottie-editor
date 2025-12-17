import type { RandomChar } from "@/lib/consts";
import type { CharPart } from "@/lib/createrandomchar";

interface CharDataDisplayProps {
  randomChar: RandomChar | null;
}

export default function CharDataDisplay({ randomChar }: CharDataDisplayProps) {
  if (!randomChar) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Character Data</h3>
        <p className="text-gray-500 text-sm">
          Generate a character to see its data
        </p>
      </div>
    );
  }

  const parts: CharPart[] = [
    "accessory",
    "head",
    "body",
    "front_arm",
    "back_arm",
    "front_leg",
    "back_leg",
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Character Data</h3>
      <div className="space-y-2">
        {parts.map((part) => (
          <div
            key={part}
            className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <span className="text-sm font-medium capitalize">
              {part.replace("_", " ")}:
            </span>
            <span className="text-sm text-gray-700 font-mono">
              {randomChar[part] + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(randomChar, null, 2));
          }}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Copy JSON
        </button>
      </div>
    </div>
  );
}
