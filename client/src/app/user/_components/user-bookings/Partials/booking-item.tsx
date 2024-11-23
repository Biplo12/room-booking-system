import { format } from "date-fns";
import { Reservation } from "@/interfaces";
import { useBookingStore } from "@/store/bookingStore";
import { cn } from "@/lib/utils";

interface BookingItemProps {
  booking: Reservation;
  type: "upcoming" | "past";
}

export function BookingItem({ booking, type }: BookingItemProps) {
  const { rooms } = useBookingStore();
  const room = rooms.find((r) => r.id === Number(booking.room_id));

  return (
    <div
      className={cn("flex items-center justify-between p-4 border rounded-lg", {
        "hover:bg-muted/50 transition-colors": type === "upcoming",
        "bg-muted/50": type !== "upcoming",
      })}
    >
      <div className="space-y-1">
        <h3 className="font-medium">{booking.title}</h3>
        <p className="text-sm text-muted-foreground">
          {room?.name} - {format(booking.start_time, "PPP")}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(booking.start_time, "h:mm a")} -{" "}
          {format(booking.end_time, "h:mm a")}
        </p>
      </div>
    </div>
  );
}
