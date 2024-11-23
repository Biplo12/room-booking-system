"use client";

import { RoomCard } from "./room-card";
import { RoomFilter } from "./room-filter";
import { useRooms } from "@/hooks/useRooms";
import { EmptyState } from "@/components/empty-state";
import { RoomCardSkeleton } from "./room-card/room-card-skeleton";
import { useBookingStore } from "@/store/bookingStore";
import { useFilterStore } from "@/store/filterStore";
import { useMemo } from "react";

const SKELETON_COUNT = 4;

export function RoomList() {
  const { isLoading, error } = useRooms();
  const { rooms } = useBookingStore();
  const { search, capacity, equipment } = useFilterStore();

  const filteredRooms = useMemo(() => {
    if (!rooms) return [];

    return rooms.filter((room) => {
      if (search && !room.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      if (capacity) {
        const roomCapacity = room.capacity;
        if (
          (capacity === "small" && roomCapacity > 4) ||
          (capacity === "medium" && (roomCapacity < 5 || roomCapacity > 8)) ||
          (capacity === "large" && roomCapacity < 9)
        ) {
          return false;
        }
      }

      if (equipment.length > 0) {
        const roomEquipment = room.equipment?.split(",") || [];
        return equipment.every((eq) => roomEquipment.includes(eq));
      }

      return true;
    });
  }, [rooms, search, capacity, equipment]);

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

      {!filteredRooms.length && !isLoading && (
        <EmptyState
          title="No Rooms Found"
          description="Try adjusting your filters to find more rooms."
          icon="Calendar"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading &&
          Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <RoomCardSkeleton key={index} />
          ))}

        {!isLoading &&
          filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)}
      </div>
    </div>
  );
}
