"use client";

import { useMemo } from "react";
import { isBefore } from "date-fns";
import { useBookingStore } from "@/store/bookingStore";
import { BookingCard } from "./Partials/booking-card";
import { useBookings } from "@/hooks/useBookings";
import { useUserStore } from "@/store/userStore";
import { BookingCardSkeleton } from "./Partials/booking-card-skeleton";

export function UserBookings() {
  const { reservations } = useBookingStore();
  const { user } = useUserStore();
  const { isLoading } = useBookings();

  const userReservations = useMemo(() => {
    if (!reservations) return { upcoming: [], past: [] };

    const filtered = reservations
      .filter((res) => res.user_id === user?.id)
      .sort((a, b) => a.start_time?.getTime() - b.start_time?.getTime());

    const now = new Date();
    return {
      upcoming: filtered.filter((res) => isBefore(now, res.start_time)),
      past: filtered.filter((res) => !isBefore(now, res.end_time)),
    };
  }, [reservations, user]);

  if (isLoading || !reservations || !user) {
    return (
      <div className="space-y-6">
        <BookingCardSkeleton />
        <BookingCardSkeleton />
      </div>
    );
  }

  const bookingCards = [
    {
      title: "Upcoming Bookings",
      description: "Your scheduled room reservations",
      bookings: userReservations.upcoming,
      type: "upcoming",
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
        />
      ))}
    </div>
  );
}
