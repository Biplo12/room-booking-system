"use client";

import { Room } from "@/interfaces";
import { useState } from "react";

interface RoomImageProps {
  room: Room;
}

export function RoomImage({ room }: RoomImageProps) {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="relative h-48 w-full overflow-hidden rounded-lg">
      {room.image_url && !hasError ? (
        <img
          src={room.image_url}
          alt={room.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105 object-center"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="h-full w-full bg-muted-foreground flex items-center justify-center">
          <span className="text-background/80 text-sm text-white">
            No image available
          </span>
        </div>
      )}
    </div>
  );
}
