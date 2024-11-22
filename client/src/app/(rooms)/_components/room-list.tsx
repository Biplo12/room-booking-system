"use client";

import { RoomCard } from "./room-card";
import { RoomFilter } from "./room-filter";
import { useRooms } from "@/hooks/useRooms";
import { EmptyState } from "@/components/empty-state";
import { RoomCardSkeleton } from "./room-card/room-card-skeleton";
import { useBookingStore } from "@/store/bookingStore";

const SKELETON_COUNT = 4;

export function RoomList() {
  const { isLoading, error } = useRooms();
  const { rooms } = useBookingStore();

  if (error) {
    return (
      <EmptyState
        title="Error Loading Rooms"
        description="There was a problem loading the rooms. Please try again."
        icon="AlertTriangle"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Rooms</h2>
      </div>
      <RoomFilter />

      {!rooms?.length && !isLoading && (
        <EmptyState
          title="No Rooms Available"
          description="No conference rooms are currently available."
          icon="Calendar"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading &&
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}

        {!isLoading &&
          rooms?.length &&
          rooms.map((room) => <RoomCard key={room.id} room={room} />)}
      </div>
    </div>
  );
}
