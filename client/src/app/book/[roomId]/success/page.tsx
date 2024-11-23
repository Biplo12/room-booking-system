"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SuccessHeader } from "./_components/success-header";
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
    <div className="container mx-auto px-4 w-full h-full flex items-center justify-center min-h-[65vh]">
      <div className="max-w-2xl mx-auto text-center">
        <SuccessHeader />
        <ActionButtons reservation={latestBooking} />
      </div>
    </div>
  );
}
