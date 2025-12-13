import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import type { LottieObject } from "@/types";
import type { AnimationFile } from "./animation-utils";

interface AnimationItemProps {
  animation: AnimationFile;
  loadAnimation: (path: string) => Promise<LottieObject>;
}

/**
 * Individual animation item component (lazy loaded)
 */
export default function AnimationItem({
  animation,
  loadAnimation,
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
      <div className="w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
        <span className="text-xs text-gray-400">Loading...</span>
      </div>
    );
  }

  if (error || !animationData) {
    return (
      <div className="w-32 h-32 border border-red-300 rounded-lg flex items-center justify-center bg-red-50">
        <span className="text-xs text-red-400">Error</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
      </div>
      <span className="text-xs text-gray-600 text-center max-w-[128px] truncate">
        {animation.fullName.replace(/\.json$/, "")}
      </span>
    </div>
  );
}
