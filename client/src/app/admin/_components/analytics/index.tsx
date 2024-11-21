"use client";

import { useBookingStore } from "@/store/bookingStore";
import { EmptyState } from "@/components/empty-state";
import { StatsOverview } from "./Partials/stats-overview";
import { BookingTrends } from "./Partials/booking-trends";

export function Analytics() {
  const { rooms, reservations } = useBookingStore();

  if (rooms.length === 0) {
    return (
      <EmptyState
        title="No Rooms Available"
        description="Add rooms to start tracking analytics"
        icon="PieChart"
      />
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <StatsOverview rooms={rooms} reservations={reservations} />
      <BookingTrends reservations={reservations} />
    </div>
  );
}
