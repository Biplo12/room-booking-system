import { Badge } from "@/components/ui/badge";
import { ActiveFiltersProps, FilterValues } from "../types";
import { X } from "lucide-react";

export function ActiveFilters({
  selectedFilters,
  onFilterRemove,
}: ActiveFiltersProps) {
  if (!selectedFilters.capacity && !selectedFilters.equipment) return null;

  const handleFilterRemove = (filterKey: keyof FilterValues) => {
    onFilterRemove(filterKey);
  };

  return (
    <div className="flex gap-2">
      {selectedFilters.capacity && (
        <Badge variant="secondary" className="text-xs py-1.5 rounded-xl">
          Capacity: {selectedFilters.capacity}
          <button
            className="ml-2"
            onClick={() => handleFilterRemove("capacity")}
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </Badge>
      )}

      {selectedFilters.equipment && (
        <Badge variant="secondary" className="text-xs py-1.5 rounded-xl">
          Equipment: {selectedFilters.equipment}
          <button
            className="ml-2"
            onClick={() => handleFilterRemove("equipment")}
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </Badge>
      )}
    </div>
  );
}
