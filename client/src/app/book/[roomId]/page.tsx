"use client";

import { useEffect, useState } from "react";
import { BookingCalendar } from "./_components/booking-calendar";
import { RoomDetails } from "./_components/room-details";
import { BookingForm } from "./_components/booking-form";
import { useBookingStore } from "@/store/bookingStore";
import { usePathname, useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { useRoom } from "@/hooks/useRooms";
import { BookingCalendarSkeleton } from "./_components/booking-calendar/booking-calendar-skeleton";
import { RoomDetailsSkeleton } from "./_components/room-details/room-details-skeleton";
import { BookingFormSkeleton } from "./_components/booking-form/booking-form-skeleton";

export default function BookRoom() {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = Number(pathname.split("/").pop());

  const { isLoading, data: selectedRoom } = useRoom(roomId);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !selectedRoom) {
      router.push("/");
    }
  }, [selectedRoom, router, isLoading]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <BookingCalendarSkeleton />
          <div className="space-y-6 lg:sticky lg:top-24">
            <RoomDetailsSkeleton />
            <BookingFormSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!selectedRoom) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <BookingCalendar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onDateSelect={setSelectedDate}
          onTimeSelect={setSelectedTime}
        />
        <div className="space-y-6 lg:sticky lg:top-24">
          <RoomDetails room={selectedRoom} />
          <BookingForm
            room={selectedRoom}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        </div>
      </div>
    </div>
  );
}
