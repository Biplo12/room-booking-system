"use client";

import { Badge } from "@/components/ui/badge";
import { Room } from "@/interfaces";

interface RoomImageProps {
  room: Room;
}

export function RoomImage({ room }: RoomImageProps) {
  return (
    <div className="relative h-48 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
      <img
        src={room.imageUrl}
        alt={room.name}
        className="h-full w-full object-cover transition-transform group-hover:scale-105 object-center"
      />
      <div className="absolute top-2 right-2 z-20">
        <Badge
          variant="secondary"
          className="backdrop-blur-sm bg-background/50"
        >
          {room.location}
        </Badge>
      </div>
    </div>
  );
}
