"use client";

import { EmptyState } from "@/components/empty-state";
import { useBookingStore } from "@/store/bookingStore";
import { format } from "date-fns";

const HEADERS = ["Room", "User", "Date", "Time", "Status"];

export function BookingHistory() {
  const { reservations } = useBookingStore();

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No Bookings Yet"
        description="Bookings will appear here once rooms are reserved"
        icon="Calendar"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Booking History</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {HEADERS.map((header) => (
                <th key={header} className="px-4 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-b">
                <td className="px-4 py-3">{reservation.roomId}</td>
                <td className="px-4 py-3">{reservation.userId}</td>
                <td className="px-4 py-3">
                  {format(reservation.startTime, "PPP")}
                </td>
                <td className="px-4 py-3">
                  {format(reservation.startTime, "p")} -{" "}
                  {format(reservation.endTime, "p")}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500">
                    Confirmed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
