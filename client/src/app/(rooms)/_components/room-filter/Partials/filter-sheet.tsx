import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSheetProps, FilterValues } from "../types";
import { FilterTrigger } from "./filter-trigger";
import { FilterSelect } from "./filter-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";

const CAPACITY_OPTIONS = [
  { value: "small", label: "1-4 people" },
  { value: "medium", label: "5-8 people" },
  { value: "large", label: "9+ people" },
];

const EQUIPMENT_OPTIONS = [
  { value: "projector", label: "Projector" },
  { value: "whiteboard", label: "Whiteboard" },
  { value: "video_conference", label: "Video Conference" },
  { value: "audio_system", label: "Audio System" },
  { value: "display_screen", label: "Display Screen" },
];

export function FilterSheet({
  selectedFilters,
  onFilterChange,
}: FilterSheetProps) {
  const [localFilters, setLocalFilters] = useState<FilterValues>({
    capacity: selectedFilters.capacity,
    equipment: selectedFilters.equipment || [],
  });

  const clearFilters = () => {
    setLocalFilters({ capacity: "", equipment: [] });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const activeFilterCount =
    (localFilters.capacity ? 1 : 0) + (localFilters.equipment?.length || 0);

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
            value={localFilters.capacity}
            onChange={(value) =>
              setLocalFilters({ ...localFilters, capacity: value })
            }
            options={CAPACITY_OPTIONS}
            placeholder="Select capacity"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Equipment</label>
            <MultiSelect
              options={EQUIPMENT_OPTIONS}
              value={localFilters.equipment}
              onChange={(value) =>
                setLocalFilters({ ...localFilters, equipment: value })
              }
              placeholder="Select equipment..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <SheetClose asChild>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
