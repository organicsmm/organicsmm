import { cn } from "@/lib/utils";
import { PLATFORM_CONFIG } from "@/lib/engagement-types";
import { Instagram, Music, Youtube, Twitter, Facebook } from "lucide-react";

interface PlatformSelectorProps {
  selected: string;
  onSelect: (platform: string) => void;
  availablePlatforms?: string[]; // Only show platforms with active bundles
}

const iconMap = {
  Instagram,
  Music,
  Youtube,
  Twitter,
  Facebook,
};

export function PlatformSelector({ selected, onSelect, availablePlatforms }: PlatformSelectorProps) {
  // Filter platforms based on availablePlatforms prop
  const platformsToShow = availablePlatforms 
    ? Object.entries(PLATFORM_CONFIG).filter(([key]) => availablePlatforms.includes(key))
    : Object.entries(PLATFORM_CONFIG);

  if (platformsToShow.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No platforms configured. Contact admin to set up engagement bundles.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {platformsToShow.map(([key, config]) => {
        const Icon = iconMap[config.icon as keyof typeof iconMap];
        const isSelected = selected === key;
        
        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200",
              "border-2",
              isSelected
                ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg scale-105`
                : "bg-secondary/50 text-muted-foreground border-border hover:border-foreground/30 hover:bg-secondary"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
