import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSheetProps } from "../types";
import { FilterTrigger } from "./filter-trigger";
import { FilterSelect } from "./filter-select";

const CAPACITY_OPTIONS = [
  { value: "small", label: "1-4 people" },
  { value: "medium", label: "5-8 people" },
  { value: "large", label: "9+ people" },
];

const EQUIPMENT_OPTIONS = [
  { value: "projector", label: "Projector" },
  { value: "whiteboard", label: "Whiteboard" },
  { value: "video", label: "Video Conference" },
];

export function FilterSheet({
  selectedFilters,
  onFilterChange,
}: FilterSheetProps) {
  const clearFilters = () => {
    onFilterChange({ capacity: "", equipment: "" });
  };

  const activeFilterCount =
    Object.values(selectedFilters).filter(Boolean).length;

  return (
    <Sheet>
      <FilterTrigger activeFilterCount={activeFilterCount} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Rooms</SheetTitle>
          <SheetDescription>
            Refine your search with specific criteria
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <FilterSelect
            label="Capacity"
            value={selectedFilters.capacity}
            onChange={(value) =>
              onFilterChange({ ...selectedFilters, capacity: value })
            }
            options={CAPACITY_OPTIONS}
            placeholder="Select capacity"
          />
          <FilterSelect
            label="Equipment"
            value={selectedFilters.equipment}
            onChange={(value) =>
              onFilterChange({ ...selectedFilters, equipment: value })
            }
            options={EQUIPMENT_OPTIONS}
            placeholder="Select equipment"
          />
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button>Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
