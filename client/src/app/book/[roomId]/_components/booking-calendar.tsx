"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TimePicker } from "./time-picker";
import { CalendarView } from "./calendar-view";

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
      <CardContent>
        <CalendarView selectedDate={selectedDate} onDateSelect={onDateSelect} />
        <TimePicker
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={onTimeSelect}
        />
      </CardContent>
    </Card>
  );
}
