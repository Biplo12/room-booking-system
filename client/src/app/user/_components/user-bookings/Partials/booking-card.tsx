import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reservation } from "@/interfaces";
import { EmptyState } from "@/components/empty-state";
import { BookingList } from "./booking-list";

interface BookingCardProps {
  title: string;
  description: string;
  bookings: Reservation[];
  type: "upcoming" | "past";
  onCancelBooking?: (reservationId: number) => void;
}

export function BookingCard({
  title,
  description,
  bookings,
  type,
  onCancelBooking,
}: BookingCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <EmptyState
            title={`No ${type} bookings`}
            description={`You have no ${type} bookings at the moment.`}
            icon="Calendar"
          />
        ) : (
          <BookingList
            bookings={bookings}
            type={type}
            onCancelBooking={onCancelBooking}
          />
        )}
      </CardContent>
    </Card>
  );
}
