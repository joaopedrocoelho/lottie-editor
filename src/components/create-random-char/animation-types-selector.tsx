import { useMemo } from "react";
import { ANIMATION_TYPES } from "@/lib/consts";
import type {
  AnimationType,
  LoserAnimation,
  WinnerAnimation,
} from "@/lib/consts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LOSER_WINNER_OPTIONS = [1, 2, 3, 4, 5];

interface AnimationTypesSelectorProps {
  handleAnimationTypeChange: (animationType: AnimationType) => void;
  isLoading: boolean;
  currentAnimationType: AnimationType;
}

const AnimationTypesSelector = ({
  handleAnimationTypeChange,
  isLoading,
  currentAnimationType,
}: AnimationTypesSelectorProps) => {
  // Extract number from currentAnimationType if it's a loser/winner animation
  const loserNumber = useMemo(() => {
    if (currentAnimationType.startsWith("loser_")) {
      const num = parseInt(currentAnimationType.split("_")[1]);
      return isNaN(num) ? 2 : num;
    }
    return 2; // Default to 2 since that's the only option available
  }, [currentAnimationType]);

  const winnerNumber = useMemo(() => {
    if (currentAnimationType.startsWith("winner_")) {
      const num = parseInt(currentAnimationType.split("_")[1]);
      return isNaN(num) ? 2 : num;
    }
    return 2; // Default to 2 since that's the only option available
  }, [currentAnimationType]);

  const isSelected = (animationType: AnimationType) => {
    return currentAnimationType === animationType;
  };

  const isLoserSelected = currentAnimationType.startsWith("loser_");
  const isWinnerSelected = currentAnimationType.startsWith("winner_");

  const getButtonClassName = (isSelected: boolean) => {
    const baseClasses =
      "px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    return isSelected
      ? `${baseClasses} bg-blue-600 text-white`
      : `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  const handleLoserButtonClick = () => {
    handleAnimationTypeChange(`loser_${loserNumber}` as LoserAnimation);
  };

  const handleWinnerButtonClick = () => {
    handleAnimationTypeChange(`winner_${winnerNumber}` as WinnerAnimation);
  };

  const handleLoserNumberChange = (value: string) => {
    const number = parseInt(value);
    handleAnimationTypeChange(`loser_${number}` as LoserAnimation);
  };

  const handleWinnerNumberChange = (value: string) => {
    const number = parseInt(value);
    handleAnimationTypeChange(`winner_${number}` as WinnerAnimation);
  };

  return (
    <div className="flex gap-x-2 flex-wrap">
      {ANIMATION_TYPES.map((animationType) => {
        if (
          animationType.startsWith("winner_") ||
          animationType.startsWith("loser_")
        ) {
          return;
        }

        return (
          <button
            key={animationType}
            type="button"
            onClick={() => handleAnimationTypeChange(animationType)}
            disabled={isLoading}
            className={getButtonClassName(isSelected(animationType))}
          >
            {animationType.replace("_", " ").toUpperCase()}
          </button>
        );
      })}
      {/* Loser button and number dropdown */}
      <div className="flex gap-x-1">
        <button
          type="button"
          onClick={handleLoserButtonClick}
          disabled={isLoading}
          className={getButtonClassName(isLoserSelected)}
        >
          LOSER
        </button>
        <Select
          value={loserNumber.toString()}
          onValueChange={handleLoserNumberChange}
          disabled={isLoading}
        >
          <SelectTrigger
            className="px-2 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 shadow-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={isLoading}
          >
            <SelectValue>{loserNumber}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LOSER_WINNER_OPTIONS.map((number) => (
              <SelectItem key={number} value={number.toString()}>
                {number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Winner button and number dropdown */}
      <div className="flex gap-x-1">
        <button
          type="button"
          onClick={handleWinnerButtonClick}
          disabled={isLoading}
          className={getButtonClassName(isWinnerSelected)}
        >
          WINNER
        </button>

        <Select
          value={winnerNumber.toString()}
          onValueChange={handleWinnerNumberChange}
          disabled={isLoading}
        >
          <SelectTrigger
            className="px-2 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 shadow-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            disabled={isLoading}
          >
            <SelectValue>{winnerNumber}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LOSER_WINNER_OPTIONS.map((number) => (
              <SelectItem key={number} value={number.toString()}>
                {number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnimationTypesSelector;
