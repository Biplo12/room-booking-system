import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterTrigger } from "./filter-trigger";
import { FilterSelect } from "./filter-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useFilterStore } from "@/store/filterStore";

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

export function FilterSheet() {
  const {
    capacity,
    equipment,
    pendingCapacity,
    pendingEquipment,
    setPendingCapacity,
    setPendingEquipment,
    applyFilters,
    clearFilters,
  } = useFilterStore();

  const activeFilterCount = (capacity ? 1 : 0) + equipment.length;

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
            value={pendingCapacity}
            onChange={setPendingCapacity}
            options={CAPACITY_OPTIONS}
            placeholder="Select capacity"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Equipment</label>
            <MultiSelect
              options={EQUIPMENT_OPTIONS}
              value={pendingEquipment}
              onChange={setPendingEquipment}
              placeholder="Select equipment..."
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <SheetClose asChild>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
