"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface BookingCalendarProps {
  selectedDate: Date;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string | null) => void;
}

export function BookingCalendar({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: BookingCalendarProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Select Date & Time</CardTitle>
        <CardDescription>
          Choose your preferred date and time slot
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
