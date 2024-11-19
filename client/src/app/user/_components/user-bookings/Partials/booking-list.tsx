import { Reservation } from "@/interfaces";
import { BookingItem } from "./booking-item";

interface BookingListProps {
  bookings: Reservation[];
  type: "upcoming" | "past";
  onCancelBooking?: (reservationId: number) => void;
}

export function BookingList({
  bookings,
  type,
  onCancelBooking,
}: BookingListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          type={type}
          onCancelBooking={onCancelBooking}
        />
      ))}
    </div>
  );
}
