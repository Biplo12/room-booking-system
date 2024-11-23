import { Badge } from "@/components/ui/badge";
import { ActiveFiltersProps, FilterValues } from "../types";
import { X } from "lucide-react";

export function ActiveFilters({
  selectedFilters,
  onFilterRemove,
}: ActiveFiltersProps) {
  if (!selectedFilters.capacity && !selectedFilters.equipment?.length)
    return null;

  const handleFilterRemove = (filterKey: keyof FilterValues) => {
    onFilterRemove(filterKey);
  };

  const formatEquipmentName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-wrap gap-2">
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

      {selectedFilters.equipment?.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="text-xs py-1.5 rounded-xl"
        >
          {formatEquipmentName(item)}
        </Badge>
      ))}
    </div>
  );
}
