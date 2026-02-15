import React from 'react';
import { GeoLocation } from '../types';
import { MapPin } from 'lucide-react';

interface WorldMapProps {
  locations: GeoLocation[];
  onLocationClick: (loc: GeoLocation) => void;
  activeLocationId?: string | null;
  highlightedIds?: string[];
  showLabels?: boolean;
  showTooltips?: boolean;
  dropTargetId?: string | null; // For drag mode
  correctIds?: string[]; // IDs already answered correctly
  wrongId?: string | null; // ID of the last wrong click
}

const WorldMap: React.FC<WorldMapProps> = ({
  locations,
  onLocationClick,
  activeLocationId,
  highlightedIds = [],
  showLabels = true,
  showTooltips = false,
  dropTargetId,
  correctIds = [],
  wrongId,
}) => {
  return (
    <div className="relative w-full aspect-[16/9] bg-blue-200 rounded-xl overflow-hidden shadow-lg border-4 border-blue-300 select-none">
      {/* Background Image */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1200px-World_map_-_low_resolution.svg.png"
        alt="Wereldkaart"
        className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none"
      />

      {/* Markers */}
      {locations.map((loc) => {
        const isCorrect = correctIds.includes(loc.id);
        const isWrong = wrongId === loc.id;
        const isActive = activeLocationId === loc.id;
        const isHighlighted = highlightedIds.includes(loc.id);
        const isDropTarget = dropTargetId === loc.id;

        // Visual styles based on state
        let bgClass = 'bg-yellow-100 text-slate-800 border-yellow-400';
        if (isCorrect) bgClass = 'bg-green-500 text-white border-green-600 scale-110 shadow-lg shadow-green-500/50';
        if (isWrong) bgClass = 'bg-red-500 text-white border-red-600 animate-pulse';
        if (isActive) bgClass = 'bg-blue-500 text-white border-blue-600 scale-125 z-10 ring-4 ring-blue-300';
        if (isDropTarget) bgClass = 'bg-indigo-200 border-dashed border-indigo-600 scale-110';

        return (
          <div
            key={loc.id}
            onClick={() => onLocationClick(loc)}
            className={`
              absolute transform -translate-x-1/2 -translate-y-1/2
              w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
              font-bold text-xs md:text-sm border-2 cursor-pointer transition-all duration-200
              ${bgClass}
              ${!showLabels && !isCorrect && !isActive ? 'opacity-70 hover:opacity-100' : 'opacity-100'}
              hover:scale-110 hover:z-20
            `}
            style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
            title={showTooltips ? loc.name : undefined}
          >
            {showLabels || isCorrect || isActive ? loc.label : '?'}
            
            {/* Tooltip for hover if enabled (mostly for debugging or specific easy modes) */}
            {showTooltips && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-30">
                {loc.name}
              </div>
            )}
          </div>
        );
      })}
      
      {/* Decorative Compass or Legend could go here */}
    </div>
  );
};

export default WorldMap;