import { cn } from "@/lib/utils";
import { DayCell } from "./day-cell";

interface CalendarGridProps {
  days: Date[];
  view: "week" | "month";
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  reservations: any[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({
  days,
  view,
  currentDate,
  selectedDate,
  onDateSelect,
  reservations,
}: CalendarGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 gap-px rounded-lg bg-muted p-px">
        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-background px-2 py-3 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className={cn(
          "grid grid-cols-7 gap-px rounded-lg bg-muted p-px",
          view === "month" ? "auto-rows-fr" : "auto-rows-[120px]"
        )}
      >
        {days.map((day) => (
          <DayCell
            key={day.toString()}
            day={day}
            currentDate={currentDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
            reservations={reservations}
          />
        ))}
      </div>
    </>
  );
}
