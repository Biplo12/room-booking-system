import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Reservation } from "@/interfaces";
import { useBookingStore } from "@/store/bookingStore";
import { cn } from "@/lib/utils";
import { CancelBookingDialog } from "./cancel-booking-dialog";
import { useCanCancel } from "../../../../../hooks/useCanCancel";

interface BookingItemProps {
  booking: Reservation;
  type: "upcoming" | "past";
  onCancelBooking?: (reservationId: number) => void;
}

export function BookingItem({
  booking,
  type,
  onCancelBooking,
}: BookingItemProps) {
  const { rooms } = useBookingStore();
  const canCancel = useCanCancel(booking.startTime);
  const room = rooms.find((r) => r.id === Number(booking.roomId));

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
          {room?.name} - {format(booking.startTime, "PPP")}
        </p>
        <p className="text-sm text-muted-foreground">
          {format(booking.startTime, "h:mm a")} -{" "}
          {format(booking.endTime, "h:mm a")}
        </p>
      </div>
      {type === "upcoming" &&
        (canCancel ? (
          <CancelBookingDialog
            bookingId={booking.id}
            onConfirm={onCancelBooking}
          />
        ) : (
          <Button variant="secondary" disabled>
            Cannot Cancel
          </Button>
        ))}
    </div>
  );
}
