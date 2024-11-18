"use client";

import { useBookingStore } from "@/store/bookingStore";
import { RoomCard } from "./room-card";

export function RoomList() {
  const { rooms } = useBookingStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Rooms</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
