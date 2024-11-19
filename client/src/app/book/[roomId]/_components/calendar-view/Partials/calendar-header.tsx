"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  date: Date;
  view: "week" | "month";
  onPrevious: () => void;
  onNext: () => void;
  onViewChange: (view: "week" | "month") => void;
  onToday: () => void;
}

export function CalendarHeader({
  date,
  view,
  onPrevious,
  onNext,
  onViewChange,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-bold">{format(date, "MMMM yyyy")}</h2>
        <div className="flex items-center rounded-lg border p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded px-3",
              view === "week" && "bg-muted"
            )}
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded px-3",
              view === "month" && "bg-muted"
            )}
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={onToday}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}