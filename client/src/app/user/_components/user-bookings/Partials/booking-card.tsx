import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reservation } from "@/interfaces";
import { EmptyState } from "@/components/empty-state";
import { BookingItem } from "./booking-item";

interface BookingCardProps {
  title: string;
  description: string;
  bookings: Reservation[];
  type: "upcoming" | "past";
}

export function BookingCard({
  title,
  description,
  bookings,
  type,
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
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingItem key={booking.id} booking={booking} type={type} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
