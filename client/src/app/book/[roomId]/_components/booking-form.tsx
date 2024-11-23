"use client";

import { ReservationForm } from "@/components/reservation-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/interfaces";

interface BookingFormProps {
  room: Room;
  selectedDate: Date;
  selectedTime: string | null;
}

export function BookingForm({
  room,
  selectedDate,
  selectedTime,
}: BookingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Room</CardTitle>
        <CardDescription>Complete your reservation</CardDescription>
      </CardHeader>
      <CardContent>
        <ReservationForm
          room={room}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </CardContent>
    </Card>
  );
}
