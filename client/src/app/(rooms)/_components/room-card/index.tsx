"use client";

import { useRouter } from "next/navigation";
import { Room } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/bookingStore";
import { useUserStore } from "@/store/userStore";
import { RoomImage } from "./Partials/room-image";
import { RoomInfo } from "./Partials/room-info";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter();
  const { reservations } = useBookingStore();
  const { isAuthenticated } = useUserStore();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push(`/login?from=/book/${room.id}`);
    } else {
      router.push(`/book/${room.id}`);
    }
  };

  return (
    <div className="group rounded-lg border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
      <RoomImage room={room} />

      <div className="p-6 space-y-4">
        <RoomInfo room={room} />

        <Button className="w-full" onClick={handleBookNow}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
