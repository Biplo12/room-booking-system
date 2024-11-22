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
    if (!user) return { total: 0, upcoming: 0, thisMonth: 0 };

    const userReservations = reservations.filter(
      (res) => res.userId === user.id
    );
    const now = new Date();
    const monthStart = startOfMonth(now);

    return {
      total: userReservations.length,
      upcoming: userReservations.filter((res) => isBefore(now, res.startTime))
        .length,
      thisMonth: userReservations.filter(
        (res) =>
          isAfter(res.startTime, monthStart) && isBefore(res.startTime, now)
      ).length,
    };
  }, [reservations, user]);

  if (isLoading) {
    return <UserStatsSkeleton />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time reservations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcoming}</div>
          <p className="text-xs text-muted-foreground">Scheduled meetings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.thisMonth}</div>
          <p className="text-xs text-muted-foreground">Monthly usage</p>
        </CardContent>
      </Card>
    </div>
  );
}
