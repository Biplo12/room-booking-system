"use client";

import { Room } from "@/interfaces";

interface RoomImageProps {
  room: Room;
}

export function RoomImage({ room }: RoomImageProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg">
      <img
        src={room.image_url}
        alt={room.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105 object-center"
      />
    </div>
  );
}
