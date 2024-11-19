"use client";

import { format } from "date-fns";
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
  const { reservations } = useBookingStore();
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

  const isTimeSlotBooked = (hour: number) => {
    const currentSlot = new Date(selectedDate);
    currentSlot.setHours(hour, 0, 0, 0);
    return reservations.some(
      (res) =>
        format(res.startTime, "yyyy-MM-dd HH") ===
        format(currentSlot, "yyyy-MM-dd HH")
    );
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
          const isSelected = selectedTime === timeString;

          return (
            <button
              key={hour}
              onClick={() => !isBooked && onTimeSelect(timeString)}
              disabled={isBooked}
              className={cn(
                "p-3 rounded-lg border text-center transition-all",
                isBooked && "bg-muted cursor-not-allowed opacity-50",
                isSelected &&
                  "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2",
                !isBooked &&
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
            </button>
          );
        })}
      </div>
    </div>
  );
}
