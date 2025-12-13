import type { LottieObject } from "@/types";

export type GroupingType = "character" | "animation";

export interface AnimationFile {
  path: string;
  animationType: string;
  character: string;
  fullName: string;
}

export interface AnimationGroup {
  key: string;
  animations: AnimationFile[];
}

/**
 * Parse animation file name to extract animation type and character
 * Patterns:
 * - walk_character01.json -> animationType: "walk", character: "01"
 * - run01_character01.json -> animationType: "run01", character: "01"
 * - loser01_character01.json -> animationType: "loser01", character: "01"
 */
export function parseAnimationFileName(fileName: string): {
  animationType: string;
  character: string;
} {
  // Remove .json extension
  const nameWithoutExt = fileName.replace(/\.json$/, "");
  
  // Match pattern: {animationType}_character{number}
  const match = nameWithoutExt.match(/^(.+?)_character(\d+)$/);
  
  if (match) {
    return {
      animationType: match[1],
      character: match[2],
    };
  }
  
  // Fallback: return the whole name as animation type
  return {
    animationType: nameWithoutExt,
    character: "unknown",
  };
}

/**
 * Get all animation files from the originals folder
 */
export function getAnimationFiles(): AnimationFile[] {
  // Use Vite's glob to get all JSON files from originals folder
  const modules = import.meta.glob<LottieObject>(
    "../chars/originals/**/*.json",
    { eager: false }
  );

  const files: AnimationFile[] = [];

  for (const path in modules) {
    // Extract folder and file name
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1];
    
    const { animationType, character } = parseAnimationFileName(fileName);
    
    files.push({
      path,
      animationType,
      character,
      fullName: fileName,
    });
  }

  return files.sort((a, b) => {
    // Sort by animation type first, then character
    if (a.animationType !== b.animationType) {
      return a.animationType.localeCompare(b.animationType);
    }
    return a.character.localeCompare(b.character);
  });
}

/**
 * Create a function to load animations dynamically
 */
export function createAnimationLoader() {
  // Use Vite's glob to get all JSON files from originals folder
  const modules = import.meta.glob<LottieObject>(
    "../chars/originals/**/*.json",
    { eager: false }
  );

  return async (path: string): Promise<LottieObject> => {
    const loader = modules[path];
    if (!loader) {
      throw new Error(`Animation not found: ${path}`);
    }
    const module = await loader();
    // Vite may return JSON directly or wrapped in default
    return (module as any).default || (module as LottieObject);
  };
}

/**
 * Group animations by character or animation type
 */
export function groupAnimations(
  files: AnimationFile[],
  groupingType: GroupingType
): AnimationGroup[] {
  const groupsMap = new Map<string, AnimationFile[]>();

  for (const file of files) {
    const key =
      groupingType === "character"
        ? `Character ${file.character}`
        : file.animationType;

    if (!groupsMap.has(key)) {
      groupsMap.set(key, []);
    }
    groupsMap.get(key)!.push(file);
  }

  // Convert to array and sort
  const groups: AnimationGroup[] = Array.from(groupsMap.entries()).map(
    ([key, animations]) => ({
      key,
      animations: animations.sort((a, b) => {
        if (groupingType === "character") {
          return a.animationType.localeCompare(b.animationType);
        }
        return a.character.localeCompare(b.character);
      }),
    })
  );

  // Sort groups
  groups.sort((a, b) => {
    if (groupingType === "character") {
      // Sort by character number
      const numA = parseInt(a.key.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.key.replace(/\D/g, "")) || 0;
      return numA - numB;
    }
    return a.key.localeCompare(b.key);
  });

  return groups;
}

