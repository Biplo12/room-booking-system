"use client";

import { useMemo } from "react";
import { isBefore } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";
import { BookingCard } from "./Partials/booking-card";
import { useBookings } from "@/hooks/useBookings";
import Spinner from "@/components/spinner";
import { useUserStore } from "@/store/userStore";

export function UserBookings() {
  const { cancelReservation, reservations } = useBookingStore();
  const { user } = useUserStore();
  const { isLoading } = useBookings();

  const userReservations = useMemo(() => {
    if (!reservations) return { upcoming: [], past: [] };

    const filtered = reservations
      .filter((res) => res.userId === user?.id)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    const now = new Date();
    return {
      upcoming: filtered.filter((res) => isBefore(now, res.startTime)),
      past: filtered.filter((res) => !isBefore(now, res.endTime)),
    };
  }, [reservations, user]);

  const handleCancelReservation = (reservationId: number) => {
    cancelReservation(reservationId);
    toast.success("Your booking has been cancelled successfully.");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const bookingCards = [
    {
      title: "Upcoming Bookings",
      description: "Your scheduled room reservations",
      bookings: userReservations.upcoming,
      type: "upcoming",
      onCancelBooking: handleCancelReservation,
    },
    {
      title: "Past Bookings",
      description: "Your booking history",
      bookings: userReservations.past,
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
