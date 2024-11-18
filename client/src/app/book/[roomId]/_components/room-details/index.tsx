"use client";

import { Room } from "@/interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomImage } from "./Partials/room-image";
import { RoomInfo } from "./Partials/room-info";

interface RoomDetailsProps {
  room: Room;
}

export function RoomDetails({ room }: RoomDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>Room Details</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoomImage room={room} />
        <RoomInfo room={room} />
      </CardContent>
    </Card>
  );
}
