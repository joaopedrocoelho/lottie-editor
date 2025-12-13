import { Suspense, lazy } from "react";
import type { LottieObject } from "@/types";
import type { AnimationFile } from "./animation-utils";

// Lazy load individual animation component
const LazyAnimationItem = lazy(() => import("./animation-item"));

interface AnimationListProps {
  animations: AnimationFile[];
  loadAnimation: (path: string) => Promise<LottieObject>;
}

/**
 * Component that displays a list of Lottie animations in a row (wrappable)
 */
export default function AnimationList({ animations, loadAnimation }: AnimationListProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {animations.map((animation) => (
        <Suspense
          key={animation.path}
          fallback={
            <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 animate-pulse">
              <span className="text-xs text-gray-400">Loading...</span>
            </div>
          }
        >
          <LazyAnimationItem animation={animation} loadAnimation={loadAnimation} />
        </Suspense>
      ))}
    </div>
  );
}

