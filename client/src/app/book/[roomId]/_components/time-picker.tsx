"use client";

import { format, isBefore, setHours, setMinutes, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingStore } from "@/store/bookingStore";

interface TimePickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimePicker({
  selectedDate,
  selectedTime,
  onTimeSelect,
}: TimePickerProps) {
  const { roomReservations } = useBookingStore();
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM
  const now = new Date();

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

  const isTimeSlotBooked = (hour: number) => {
    try {
      const slotStart = setHours(setMinutes(selectedDate, 0), hour);
      const slotEnd = setHours(setMinutes(selectedDate, 0), hour + 1);

      const isBooked = roomReservations.some((res) => {
        try {
          const resStart = parseReservationDate(res.start_time);
          const resEnd = parseReservationDate(res.end_time);

          if (!resStart || !resEnd) return false;

          return (
            (slotStart >= resStart && slotStart < resEnd) ||
            (slotEnd > resStart && slotEnd <= resEnd) ||
            (slotStart <= resStart && slotEnd >= resEnd)
          );
        } catch (error) {
          console.error("Error comparing reservation:", error);
          return false;
        }
      });

      return isBooked;
    } catch (error) {
      console.error("Error in isTimeSlotBooked:", error);
      return true;
    }
  };

  const isTimeSlotPast = (hour: number) => {
    try {
      const timeSlot = setHours(setMinutes(selectedDate, 0), hour);
      if (isNaN(timeSlot.getTime())) return true;
      return isBefore(timeSlot, now);
    } catch {
      return true;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Available Time Slots</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {hours.map((hour) => {
          const timeString = `${hour.toString().padStart(2, "0")}:00`;
          const isBooked = isTimeSlotBooked(hour);
          const isPast = isTimeSlotPast(hour);
          const isDisabled = isBooked || isPast;
          const isSelected = selectedTime === timeString;

          return (
            <button
              key={hour}
              onClick={() => !isDisabled && onTimeSelect(timeString)}
              disabled={isDisabled}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                isDisabled && "bg-muted cursor-not-allowed opacity-50",
                isSelected &&
                  !isDisabled &&
                  "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2",
                !isDisabled &&
                  !isSelected &&
                  "hover:border-primary/50 hover:bg-muted/50 cursor-pointer"
              )}
            >
              <span className="font-medium">
                {format(new Date().setHours(hour, 0, 0, 0), "h:mm a")}
              </span>
              {isBooked && (
                <span className="block text-xs text-muted-foreground mt-1">
                  Booked
                </span>
              )}
              {!isBooked && isPast && (
                <span className="block text-xs text-muted-foreground mt-1">
                  Past
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
