"use client";

import { useBookingStore } from "@/store/bookingStore";
import { EmptyState } from "@/components/empty-state";
import { StatsOverview } from "./Partials/stats-overview";
import { BookingTrends } from "./Partials/booking-trends";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { StatsOverviewSkeleton } from "./Partials/stats-overview-skeleton";
import { BookingTrendsSkeleton } from "./Partials/booking-trends-skeleton";

export function Analytics() {
  const { isLoading: roomsLoading } = useRooms();
  const { isLoading: bookingsLoading } = useBookings();
  const { rooms } = useBookingStore();

  const isLoading = roomsLoading || bookingsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <StatsOverviewSkeleton />
        <BookingTrendsSkeleton />
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
