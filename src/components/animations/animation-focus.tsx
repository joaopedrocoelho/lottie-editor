import { useRef, useState, useEffect } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import type { LottieObject } from "@/types";
import type { AnimationFile } from "./animation-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnimationControls from "@/components/create-random-char/animation-controls";

interface AnimationFocusProps {
  animation: AnimationFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loadAnimation: (path: string) => Promise<LottieObject>;
}

/**
 * Dialog component that displays a focused view of an animation
 * Similar to CreateRandomChar but in a dialog format
 */
export default function AnimationFocus({
  animation,
  open,
  onOpenChange,
  loadAnimation,
}: AnimationFocusProps) {
  const [animationData, setAnimationData] = useState<LottieObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState<number>(0);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [hueRotation, setHueRotation] = useState(0);
  const [saturation, setSaturation] = useState(100);

  // Load animation when dialog opens and animation changes
  useEffect(() => {
    if (!open || !animation) {
      return;
    }

    const currentAnimation = animation;
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        setAnimationData(null);
        const data = await loadAnimation(currentAnimation.path);
        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
          setKey((prev) => prev + 1);
        }
      } catch (err) {
        console.error(
          `Failed to load animation ${currentAnimation.path}:`,
          err
        );
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [open, animation, loadAnimation]);

  // Reset controls when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset on next tick to avoid cascading renders
      setTimeout(() => {
        setHueRotation(0);
        setSaturation(100);
        setAnimationData(null);
        setLoading(true);
      }, 0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-white">
            {animation?.fullName.replace(/\.json$/, "") || "Animation"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-4 w-full h-full">
          <div className="lottie-container flex items-center justify-center w-full h-full overflow-hidden p-4">
            {loading ? (
              <div className="text-white">Loading animation...</div>
            ) : animationData ? (
              <div
                className="flex items-center justify-center w-full h-[500px]"
                style={{
                  filter: `hue-rotate(${hueRotation}deg) saturate(${saturation}%)`,
                }}
              >
                <Lottie
                  key={key}
                  animationData={animationData}
                  loop={true}
                  lottieRef={lottieRef}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="text-white">No animation data</div>
            )}
          </div>
          {animationData && (
            <AnimationControls
              lottieRef={lottieRef}
              setHueRotation={setHueRotation}
              setSaturation={setSaturation}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
