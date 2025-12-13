import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimationList from "./animation-list";
import {
  getAnimationFiles,
  groupAnimations,
  createAnimationLoader,
  type GroupingType,
} from "./animation-utils";

/**
 * Page component that displays all animations from the originals folder
 * with sorting options by character or animation type
 */
export default function AnimationsPage() {
  const [groupingType, setGroupingType] = useState<GroupingType>("animation");
  
  // Get all animation files
  const animationFiles = useMemo(() => getAnimationFiles(), []);
  
  // Group animations based on selected grouping type
  const groupedAnimations = useMemo(
    () => groupAnimations(animationFiles, groupingType),
    [animationFiles, groupingType]
  );

  // Create animation loader function
  const loadAnimation = useMemo(() => createAnimationLoader(), []);

  return (
    <div className="w-full h-full py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Animation Gallery</h1>
        <div className="flex gap-4">
          <Button
            variant={groupingType === "animation" ? "default" : "outline"}
            onClick={() => setGroupingType("animation")}
          >
            Group by Animation Type
          </Button>
          <Button
            variant={groupingType === "character" ? "default" : "outline"}
            onClick={() => setGroupingType("character")}
          >
            Group by Character
          </Button>
        </div>
      </div>

      <Accordion type="multiple" className="w-full">
        {groupedAnimations.map((group) => (
          <AccordionItem key={group.key} value={group.key}>
            <AccordionTrigger className="text-lg font-semibold">
              {group.key} ({group.animations.length} animations)
            </AccordionTrigger>
            <AccordionContent>
              <AnimationList
                animations={group.animations}
                loadAnimation={loadAnimation}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

