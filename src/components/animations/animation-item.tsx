import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { ZoomIn } from "lucide-react";
import type { LottieObject } from "@/types";
import type { AnimationFile } from "./animation-utils";

interface AnimationItemProps {
  animation: AnimationFile;
  loadAnimation: (path: string) => Promise<LottieObject>;
  onZoomClick?: (animation: AnimationFile) => void;
}

/**
 * Individual animation item component (lazy loaded)
 */
export default function AnimationItem({
  animation,
  loadAnimation,
  onZoomClick,
}: AnimationItemProps) {
  const [animationData, setAnimationData] = useState<LottieObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await loadAnimation(animation.path);

        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(`Failed to load animation ${animation.path}:`, err);
        if (isMounted) {
          setError("Failed to load animation");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [animation.path, loadAnimation]);

  if (loading) {
    return (
      <div className="w-56 h-56 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
        <span className="text-md text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div className="w-56 h-56 border border-red-300 rounded-lg flex items-center justify-center bg-red-50">
        <span className="text-md text-red-400">Error</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-56 h-56 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow group">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
        {onZoomClick && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onZoomClick(animation);
            }}
            className="absolute top-0 left-0 p-1 opacity-100 rounded-full bg-purple-100 z-10"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-black" />
          </button>
        )}
      </div>
      <span className="text-md text-white text-center w-full">
        {animation.fullName.replace(/\.json$/, "")}
      </span>
    </div>
  );
}
