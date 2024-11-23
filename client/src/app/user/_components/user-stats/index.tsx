"use client";

import { useMemo } from "react";
import { startOfMonth, isBefore, isAfter } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/store/bookingStore";
import { useUserStore } from "@/store/userStore";
import { useBookings } from "@/hooks/useBookings";
import { UserStatsSkeleton } from "./user-stats-skeleton";

export function UserStats() {
  const { isLoading } = useBookings();
  const { reservations } = useBookingStore();
  const { user } = useUserStore();

  const stats = useMemo(() => {
    const userReservations = reservations.filter(
      (res) => res.user_id === user?.id
    );
    const now = new Date();
    const monthStart = startOfMonth(now);

    return {
      total: userReservations.length,
      upcoming: userReservations.filter((res) => isBefore(now, res.start_time))
        .length,
      thisMonth: userReservations.filter(
        (res) =>
          isAfter(res.start_time, monthStart) && isBefore(res.start_time, now)
      ).length,
    };
  }, [reservations, user]);

  if (isLoading || !reservations || !user) {
    return <UserStatsSkeleton />;
  }

  const statsCards = [
    {
      title: "Total Bookings",
      subtitle: "All time reservations",
      value: stats.total,
    },
    {
      title: "Upcoming Bookings",
      subtitle: "Scheduled meetings",
      value: stats.upcoming,
    },
    {
      title: "This Month",
      subtitle: "Monthly usage",
      value: stats.thisMonth,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statsCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
