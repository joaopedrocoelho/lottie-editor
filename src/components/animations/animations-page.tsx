import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimationList from "./animation-list";
import AnimationFocus from "./animation-focus";
import {
  getAnimationFiles,
  groupAnimations,
  createAnimationLoader,
  type GroupingType,
  type AnimationFile,
} from "./animation-utils";

/**
 * Page component that displays all animations from the originals folder
 * with sorting options by character or animation type
 */
export default function AnimationsPage() {
  const [groupingType, setGroupingType] = useState<GroupingType>("animation");
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationFile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get all animation files
  const animationFiles = useMemo(() => getAnimationFiles(), []);

  // Group animations based on selected grouping type
  const groupedAnimations = useMemo(
    () => groupAnimations(animationFiles, groupingType),
    [animationFiles, groupingType]
  );

  // Create animation loader function
  const loadAnimation = useMemo(() => createAnimationLoader(), []);

  const handleZoomClick = (animation: AnimationFile) => {
    setSelectedAnimation(animation);
    setDialogOpen(true);
  };

  return (
    <div className="w-full h-full py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">
          Animation Gallery
        </h1>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setGroupingType("animation")}
            className={`px-4 py-2 rounded border-4 transition-all text-white ${
              groupingType === "animation"
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`}
          >
            Group by Animation Type
          </button>
          <button
            type="button"
            onClick={() => setGroupingType("character")}
            className={`px-4 py-2 rounded border-4 transition-all text-white ${
              groupingType === "character"
                ? "bg-indigo-400 border-white"
                : "bg-indigo-400 border-transparent hover:bg-indigo-600"
            }`}
          >
            Group by Character
          </button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {groupedAnimations.map((group) => (
          <AccordionItem key={group.key} value={group.key}>
            <AccordionTrigger className="text-lg font-semibold text-white">
              {group.key} ({group.animations.length} animations)
            </AccordionTrigger>
            <AccordionContent>
              <AnimationList
                animations={group.animations}
                loadAnimation={loadAnimation}
                onZoomClick={handleZoomClick}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <AnimationFocus
        animation={selectedAnimation}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        loadAnimation={loadAnimation}
      />
    </div>
  );
}
