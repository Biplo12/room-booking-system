"use client";

import { useMemo } from "react";
import { isBefore } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";
import { BookingCard } from "./Partials/booking-card";

export function UserBookings() {
  const { reservations, cancelReservation } = useBookingStore();
  const currentUserId = "user-1";

  const userReservations = useMemo(() => {
    return reservations
      .filter((res) => res.userId === currentUserId)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [reservations]);

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    return {
      upcoming: userReservations.filter((res) => isBefore(now, res.startTime)),
      past: userReservations.filter((res) => !isBefore(now, res.endTime)),
    };
  }, [userReservations]);

  const handleCancelReservation = (reservationId: number) => {
    cancelReservation(reservationId);
    toast.success("Your booking has been cancelled successfully.");
  };

  const bookingCards = [
    {
      title: "Upcoming Bookings",
      description: "Your scheduled room reservations",
      bookings: upcoming,
      type: "upcoming",
      onCancelBooking: handleCancelReservation,
    },
    {
      title: "Past Bookings",
      description: "Your booking history",
      bookings: past,
      type: "past",
    },
  ];

  return (
    <div className="space-y-6">
      {bookingCards.map((card) => (
        <BookingCard
          key={card.title}
          title={card.title}
          description={card.description}
          bookings={card.bookings}
          type={card.type as "upcoming" | "past"}
          onCancelBooking={card.onCancelBooking}
        />
      ))}
    </div>
  );
}
