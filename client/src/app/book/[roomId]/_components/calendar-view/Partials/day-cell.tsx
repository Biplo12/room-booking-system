import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isEqual, isSameMonth, isToday } from "date-fns";

interface DayCellProps {
  day: Date;
  view: "week" | "month";
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  reservations: any[];
}

export function DayCell({
  day,
  view,
  currentDate,
  selectedDate,
  onDateSelect,
  reservations,
}: DayCellProps) {
  const dayReservations = reservations.filter(
    (res) => format(res.startTime, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
  );

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-full w-full p-2 font-normal hover:bg-muted/50",
        !isSameMonth(day, currentDate) && "text-muted-foreground",
        isEqual(day, selectedDate) && "bg-primary/10",
        isToday(day) && "border-2 border-primary"
      )}
      onClick={() => onDateSelect(day)}
    >
      <div className="flex flex-col h-full">
        <time
          dateTime={format(day, "yyyy-MM-dd")}
          className={cn(
            "mb-1 flex h-7 w-7 items-center justify-center rounded-full",
            isEqual(day, selectedDate) && "bg-primary text-primary-foreground"
          )}
        >
          {format(day, "d")}
        </time>
        {dayReservations.length > 0 && (
          <div className="mt-1">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs">
              {dayReservations.length} booking
              {dayReservations.length !== 1 ? "s" : ""}
            </div>
            {view === "week" &&
              dayReservations.map((res) => (
                <div
                  key={res.id}
                  className="mt-1 text-xs truncate text-muted-foreground"
                >
                  {format(res.startTime, "h:mm a")} - {res.title}
                </div>
              ))}
          </div>
        )}
      </div>
    </Button>
  );
}
