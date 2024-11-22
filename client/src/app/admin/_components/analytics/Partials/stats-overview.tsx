"use client";

import { useBookingStore } from "@/store/bookingStore";
import { StatsCard } from "./stats-card";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { StatsOverviewSkeleton } from "./stats-overview-skeleton";

export function StatsOverview() {
  const { isLoading: roomsLoading } = useRooms();
  const { isLoading: bookingsLoading } = useBookings();
  const { rooms, reservations } = useBookingStore();

  if (roomsLoading || bookingsLoading) {
    return <StatsOverviewSkeleton />;
  }

  const calculateUtilizationRate = () => {
    if (rooms.length === 0) return 0;
    return Math.round((reservations.length / (rooms.length * 12)) * 100);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Total Rooms"
        description="Number of available rooms"
        value={rooms.length}
      />
      <StatsCard
        title="Total Bookings"
        description="Number of reservations"
        value={reservations.length}
      />
      <StatsCard
        title="Utilization Rate"
        description="Room usage percentage"
        value={`${calculateUtilizationRate()}%`}
      />
    </div>
  );
}
