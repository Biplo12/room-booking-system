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
  const parseReservationDate = (dateValue: string | Date | undefined) => {
    if (!dateValue) return null;
    try {
      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        return dateValue;
      }
      if (typeof dateValue === "string") {
        const parsedDate = parseISO(dateValue);
        return !isNaN(parsedDate.getTime()) ? parsedDate : null;
      }
      return null;
    } catch {
      return null;
    }
  };

  const dayReservations = reservations.filter((res) => {
    try {
      const resDate = parseReservationDate(res.start_time);
      if (!resDate || isNaN(resDate.getTime())) return false;
      return format(resDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
    } catch {
      return false;
    }
  });

  const isDayFullyBooked = () => {
    const dayBookings = reservations.filter((res) => {
      try {
        const resDate = parseReservationDate(res.start_time);
        if (!resDate || isNaN(resDate.getTime())) return false;
        return format(resDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      } catch {
        return false;
      }
    });

    const bookedHours = new Set(
      dayBookings
        .map((booking) => {
          const date = parseReservationDate(booking.start_time);
          return date && !isNaN(date.getTime()) ? date.getHours() : null;
        })
        .filter(
          (hour): hour is number =>
            hour !== null && hour !== undefined && !isNaN(hour)
        )
    );

    const businessHours = Array.from({ length: 12 }, (_, i) => i + 8);
    return businessHours.every((hour) => bookedHours.has(hour));
  };

  const isPastDay = isBefore(day, startOfDay(new Date()));
  const isDisabled = isPastDay || isDayFullyBooked();

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-full w-full p-2 font-normal",
        !isSameMonth(day, currentDate) && "text-muted-foreground",
        isEqual(day, selectedDate) && "bg-primary/10",
        isToday(day) && "border-2 border-primary",
        isDisabled
          ? "opacity-50 cursor-not-allowed bg-muted"
          : "hover:bg-muted/50"
      )}
      onClick={() => !isDisabled && onDateSelect(day)}
      disabled={isDisabled}
    >
      <div className="flex flex-col h-full justify-center items-center">
        <time
          dateTime={format(day, "yyyy-MM-dd")}
          className={cn(
            "mb-1 flex h-7 w-7 items-center justify-center rounded-full",
            isEqual(day, selectedDate) &&
              !isDisabled &&
              "bg-primary text-primary-foreground"
          )}
        >
          {format(day, "d")}
        </time>

        {dayReservations.length > 0 && (
          <div className="mt-1">
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-1 text-xs">
              {isDayFullyBooked() ? (
                "Fully Booked"
              ) : (
                <>
                  {dayReservations.length} Booking
                  {dayReservations.length !== 1 ? "s" : ""}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Button>
  );
}
