import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SheetTrigger } from "@/components/ui/sheet";

interface FilterTriggerProps {
  activeFilterCount: number;
}

export function FilterTrigger({ activeFilterCount }: FilterTriggerProps) {
  return (
    <SheetTrigger asChild>
      <Button variant="outline" className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    </SheetTrigger>
  );
}
