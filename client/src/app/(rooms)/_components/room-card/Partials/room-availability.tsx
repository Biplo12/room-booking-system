"use client";

import { Calendar, Clock } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface RoomAvailabilityProps {
  todayReservations: number;
}

const MAX_RESERVATIONS = 12;

export function RoomAvailability({ todayReservations }: RoomAvailabilityProps) {
  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      <HoverCard>
        <HoverCardTrigger className="cursor-help">
          <span className="text-sm">{todayReservations} bookings today</span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <p className="text-sm font-medium">Today&apos;s Availability</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {MAX_RESERVATIONS - todayReservations} time slots available
              </span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
