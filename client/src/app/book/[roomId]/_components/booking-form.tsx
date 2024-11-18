"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string | null;
}

export function BookingForm({ selectedDate, selectedTime }: BookingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Room</CardTitle>
        <CardDescription>Complete your reservation</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
