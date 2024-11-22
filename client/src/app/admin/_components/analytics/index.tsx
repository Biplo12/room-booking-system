"use client";

import { useBookingStore } from "@/store/bookingStore";
import { EmptyState } from "@/components/empty-state";
import { StatsOverview } from "./Partials/stats-overview";
import { BookingTrends } from "./Partials/booking-trends";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import Spinner from "@/components/spinner";

export function Analytics() {
  const { isLoading: roomsLoading } = useRooms();
  const { isLoading: bookingsLoading } = useBookings();
  const { rooms } = useBookingStore();

  if (roomsLoading || bookingsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!rooms?.length) {
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
      <StatsOverview />
      <BookingTrends />
    </div>
  );
}
