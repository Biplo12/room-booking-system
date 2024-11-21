import { StatsCard } from "./stats-card";
import { Room, Reservation } from "@/interfaces";

interface StatsOverviewProps {
  rooms: Room[];
  reservations: Reservation[];
}

export function StatsOverview({ rooms, reservations }: StatsOverviewProps) {
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
