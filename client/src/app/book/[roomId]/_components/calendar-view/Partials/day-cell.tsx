import { Button } from "@/components/ui/button";
import { Reservation } from "@/interfaces";
import { cn } from "@/lib/utils";
import {
  format,
  isEqual,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";

interface DayCellProps {
  day: Date;
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  reservations: Reservation[];
}

export function DayCell({
  day,
  currentDate,
  selectedDate,
  onDateSelect,
  reservations,
}: DayCellProps) {
  const dayReservations = reservations.filter((res) => {
    try {
      const resDate =
        typeof res.start_time === "string"
          ? parseISO(res.start_time)
          : res.start_time instanceof Date
          ? res.start_time
          : new Date();

      return format(resDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    } catch (error) {
      console.error("Invalid date format:", res.start_time);
      return false;
    }
  });

  const isPastDay = isBefore(day, startOfDay(new Date()));

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-full w-full p-2 font-normal",
        !isSameMonth(day, currentDate) && "text-muted-foreground",
        isEqual(day, selectedDate) && "bg-primary/10",
        isToday(day) && "border-2 border-primary",
        isPastDay
          ? "opacity-50 cursor-not-allowed bg-muted"
          : "hover:bg-muted/50"
      )}
      onClick={() => !isPastDay && onDateSelect(day)}
      disabled={isPastDay}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <time
          dateTime={format(day, "yyyy-MM-dd")}
          className={cn(
            "mb-1 flex h-7 w-7 items-center justify-center rounded-full",
            isEqual(day, selectedDate) &&
              !isPastDay &&
              "bg-primary text-primary-foreground"
          )}
        >
          {format(day, "d")}
        </time>

        {dayReservations.length > 0 && (
          <div className="mt-1">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs">
              {dayReservations.length} Booking
              {dayReservations.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    </Button>
  );
}
