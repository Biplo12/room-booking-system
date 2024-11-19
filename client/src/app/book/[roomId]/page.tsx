"use client";

import { useEffect, useState } from "react";
import { BookingCalendar } from "./_components/booking-calendar";
import { RoomDetails } from "./_components/room-details";
import { BookingForm } from "./_components/booking-form";
import { useBookingStore } from "@/store/bookingStore";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { BackButton } from "@/components/back-button";

export default function BookRoom() {
  const router = useRouter();
  const pathname = usePathname();
  const { rooms } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const roomId = pathname.split("/").pop();

  const selectedRoom = rooms.find((r) => r.id === Number(roomId));

  useEffect(() => {
    if (!selectedRoom) {
      router.push("/");
    }
  }, [selectedRoom, router]);

  if (!selectedRoom)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

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
