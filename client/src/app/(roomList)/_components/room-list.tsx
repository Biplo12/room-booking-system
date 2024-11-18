"use client";

import { useBookingStore } from "@/store/bookingStore";

export function RoomList() {
  const { rooms, setRooms } = useBookingStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Rooms</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => room.id)}
      </div>
    </div>
  );
}
