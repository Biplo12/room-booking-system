import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";

export function ActiveFilters() {
  const { capacity, equipment, setPendingCapacity, setPendingEquipment } =
    useFilterStore();

  if (!capacity && !equipment.length) return null;

  const formatEquipmentName = (name: string) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-wrap gap-2">
      {capacity && (
        <Badge variant="secondary" className="text-xs py-1.5 rounded-xl">
          Capacity: {capacity}
          <button className="ml-2" onClick={() => setPendingCapacity("")}>
            <X className="w-4 h-4 text-red-500" />
          </button>
        </Badge>
      )}

      {equipment.map((item) => (
        <Badge
          key={item}
          variant="secondary"
          className="text-xs py-1.5 rounded-xl"
        >
          {formatEquipmentName(item)}
          <button
            className="ml-2"
            onClick={() =>
              setPendingEquipment(equipment.filter((eq) => eq !== item))
            }
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
