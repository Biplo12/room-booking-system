"use client";

import { useMemo } from "react";
import { isBefore, isAfter, startOfMonth } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookingStore } from "@/store/bookingStore";

export function UserStats() {
  const { reservations } = useBookingStore();
  const currentUserId = "user-1";

  const stats = useMemo(() => {
    const userReservations = reservations.filter(
      (res) => res.userId === currentUserId
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
  }, [reservations]);

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
