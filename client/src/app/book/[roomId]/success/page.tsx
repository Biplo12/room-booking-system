"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SuccessHeader } from "./_components/success-header";
import { ReservationDetails } from "./_components/booking-details";
import { ActionButtons } from "./_components/action-buttons";
import { useBookingStore } from "@/store/bookingStore";

export default function BookingSuccess() {
  const router = useRouter();
  const { reservations } = useBookingStore();
  const latestBooking = reservations[reservations.length - 1];

  useEffect(() => {
    if (!latestBooking) {
      router.push("/");
    }
  }, [latestBooking, router]);

  if (!latestBooking) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <SuccessHeader />
        <ReservationDetails reservation={latestBooking} />
        <ActionButtons reservation={latestBooking} />
      </div>
    </div>
  );
}
