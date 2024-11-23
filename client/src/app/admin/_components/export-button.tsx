"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useBookingStore } from "@/store/bookingStore";

export function ExportButton() {
  const { rooms, reservations } = useBookingStore();

  const handleExport = () => {
    const roomUsageData = rooms.map((room) => {
      const roomReservations = reservations.filter(
        (res) => res.room_id === Number(room.id)
      );
      const totalHours = roomReservations.reduce((acc, res) => {
        const duration =
          new Date(res.end_time).getTime() - new Date(res.start_time).getTime();
        return acc + duration / (1000 * 60 * 60);
      }, 0);

      return {
        "Room ID": room.id,
        "Room Name": room.name,
        Capacity: room.capacity,
        Location: room.location,
        Equipment: room.equipment || "-",
        "Total Bookings": roomReservations.length,
        "Total Hours Used": totalHours.toFixed(1),
        "Average Hours/Booking":
          roomReservations.length > 0
            ? (totalHours / roomReservations.length).toFixed(1)
            : "0",
      };
    });

    // Bookings Sheet
    const bookingsData = reservations.map((booking) => {
      const room = rooms.find((r) => r.id === Number(booking.room_id));
      return {
        "Booking ID": booking.id,
        Room: room?.name || booking.room_id,
        Title: booking.title,
        Date: new Date(booking.start_time).toLocaleDateString(),
        "Start Time": new Date(booking.start_time).toLocaleTimeString(),
        "End Time": new Date(booking.end_time).toLocaleTimeString(),
        "Duration (Hours)": (
          (new Date(booking.end_time).getTime() -
            new Date(booking.start_time).getTime()) /
          (1000 * 60 * 60)
        ).toFixed(1),
        Description: booking.description || "-",
        "User ID": booking.user_id,
      };
    });

    const wb = XLSX.utils.book_new();

    // Add Room Usage Sheet
    const wsRoomUsage = XLSX.utils.json_to_sheet(roomUsageData);
    XLSX.utils.book_append_sheet(wb, wsRoomUsage, "Room Usage Report");

    // Add Bookings Sheet
    const wsBookings = XLSX.utils.json_to_sheet(bookingsData);
    XLSX.utils.book_append_sheet(wb, wsBookings, "Bookings");

    XLSX.writeFile(
      wb,
      `room-booking-report-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={handleExport}
      disabled={!reservations.length}
    >
      <Download className="h-4 w-4" />
      Export Report
    </Button>
  );
}
