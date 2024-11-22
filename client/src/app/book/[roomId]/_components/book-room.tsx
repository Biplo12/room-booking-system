"use client";

import { useEffect, useState } from "react";
import { BookingCalendar } from "./booking-calendar";
import { RoomDetails } from "./room-details";
import { BookingForm } from "./booking-form";
import { useBookingStore } from "@/store/bookingStore";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "@/components/spinner";
import { BackButton } from "@/components/back-button";
import { useRoom, useRooms } from "@/hooks/useRooms";

export function BookRoom() {
  const router = useRouter();
  const pathname = usePathname();
  const roomId = Number(pathname.split("/").pop());

  const { isLoading } = useRoom(roomId);
  const { rooms } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const selectedRoom = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    if (!isLoading && !selectedRoom) {
      router.push("/");
    }
  }, [selectedRoom, router, isLoading]);

  if (isLoading || !selectedRoom) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

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
