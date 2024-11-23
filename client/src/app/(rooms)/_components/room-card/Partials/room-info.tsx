"use client";

import { Users, Monitor } from "lucide-react";
import { Room } from "@/interfaces";
import { Badge } from "@/components/ui/badge";

interface RoomInfoProps {
  room: Room;
}

export function RoomInfo({ room }: RoomInfoProps) {
  const equipmentArray =
    typeof room.equipment === "string"
      ? room.equipment
          .split(",")
          .filter(Boolean)
          .map((item) => item.trim())
      : Array.isArray(room.equipment)
      ? room.equipment
      : [];

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold">{room.name}</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Capacity: {room.capacity} people</span>
        </div>
        {equipmentArray.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span>Equipment:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {equipmentArray.map((item) => (
                <Badge key={item} variant="secondary">
                  {item
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
