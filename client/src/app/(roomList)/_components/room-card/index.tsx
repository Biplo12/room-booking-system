"use client";

import { useRouter } from "next/navigation";
import { Room } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/bookingStore";
import { RoomImage } from "./Partials/room-image";
import { RoomInfo } from "./Partials/room-info";
import { RoomAvailability } from "./Partials/room-availability";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const { reservations } = useBookingStore();

  const handleBookNow = () => {
    router.push(`/book/${room.id}`);
  };

  const todayReservations = reservations.filter(
    (res) =>
      Number(res.roomId) === Number(room.id) &&
      new Date(res.startTime).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="group rounded-lg border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <RoomImage room={room} />

      <div className="p-6 space-y-4">
        <div>
          <RoomInfo room={room} />
          <RoomAvailability todayReservations={todayReservations} />
        </div>

        <Button className="w-full" onClick={handleBookNow}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
