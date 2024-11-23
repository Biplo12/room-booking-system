"use client";

import { format } from "date-fns";
import { EmptyState } from "@/components/empty-state";
import { useBookings } from "@/hooks/useBookings";
import { useBookingStore } from "@/store/bookingStore";
import { BookingHistorySkeleton } from "./booking-history-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HEADERS = ["Room", "User", "Date", "Time", "Status"];

export function BookingHistory() {
  const { isLoading } = useBookings();
  const { reservations } = useBookingStore();

  if (isLoading) {
    return <BookingHistorySkeleton />;
  }

  if (!reservations?.length) {
    return (
      <div className="mt-10">
        <EmptyState
          title="No Bookings Yet"
          description="Bookings will appear here once rooms are reserved"
          icon="Calendar"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Booking History</h2>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {HEADERS.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{reservation.room_id}</TableCell>
                <TableCell>{reservation.user_id}</TableCell>
                <TableCell>{format(reservation.start_time, "PPP")}</TableCell>
                <TableCell>
                  {format(reservation.start_time, "p")} -{" "}
                  {format(reservation.end_time, "p")}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                    Confirmed
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
