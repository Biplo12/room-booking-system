"use client";

import { Users, Monitor } from "lucide-react";
import { Room } from "@/interfaces";

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold">{room.name}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Capacity: {room.capacity} people</span>
        </div>
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          <span>{room.equipment.join(", ")}</span>
        </div>
      </div>
    </div>
  );
}
