"use client";

import { Users, Monitor, MapPin } from "lucide-react";
import { Room } from "@/interfaces";

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        <span>Capacity: {room.capacity}</span>
      </div>
      <div className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        <span>{room.equipment}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span>{room.location}</span>
      </div>
    </div>
  );
}
