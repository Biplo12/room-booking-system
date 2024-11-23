import { Card } from "@/components/ui/card";
import { Reservation } from "@/interfaces";

interface ReservationDetailsProps {
  reservation: Reservation;
}

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <Card className="p-6 mb-8 text-left">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Meeting Title</h3>
          <p className="text-muted-foreground">{reservation.title}</p>
        </div>
        <div>
          <h3 className="font-medium">Date & Time</h3>
          <p className="text-muted-foreground">
            {new Date(reservation.start_time).toLocaleDateString()} at{" "}
            {new Date(reservation.start_time).toLocaleTimeString()} -{" "}
            {new Date(reservation.end_time).toLocaleTimeString()}
          </p>
        </div>
        {reservation.description && (
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-muted-foreground">{reservation.description}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
