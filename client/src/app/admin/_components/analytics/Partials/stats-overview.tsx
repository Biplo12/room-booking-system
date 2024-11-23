"use client";

import { useBookingStore } from "@/store/bookingStore";
import { StatsCard } from "./stats-card";
import { useRooms } from "@/hooks/useRooms";
import { useBookings } from "@/hooks/useBookings";
import { StatsOverviewSkeleton } from "./stats-overview-skeleton";

const BUSINESS_HOURS_PER_DAY = 12;

export function StatsOverview() {
  const { isLoading: roomsLoading } = useRooms();
  const { isLoading: bookingsLoading } = useBookings();
  const { rooms, reservations } = useBookingStore();

  if (roomsLoading || bookingsLoading) {
    return <StatsOverviewSkeleton />;
  }

  const calculateUtilizationRate = () => {
    if (rooms.length === 0) return 0;
    return Math.round(
      (reservations.length / (rooms.length * BUSINESS_HOURS_PER_DAY)) * 100
    );
  };

  const statsCards = [
    {
      title: "Total Rooms",
      description: "Number of available rooms",
      value: rooms.length,
    },
    {
      title: "Total Bookings",
      description: "Number of reservations",
      value: reservations.length,
    },
    {
      title: "Utilization Rate",
      description: "Room usage percentage",
      value: `${calculateUtilizationRate()}%`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsCards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </div>
  );
}
