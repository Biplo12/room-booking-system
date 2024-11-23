"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useBookingStore } from "@/store/bookingStore";

export function ExportButton() {
  const { rooms, reservations } = useBookingStore();

  const handleExport = () => {
    const bookingsData = reservations.map((booking) => {
      const room = rooms.find((r) => r.id === Number(booking.room_id));
      return {
        "Booking ID": booking.id,
        Room: room?.name || booking.room_id,
        Title: booking.title,
        Date: new Date(booking.start_time).toLocaleDateString(),
        "Start Time": new Date(booking.start_time).toLocaleTimeString(),
        "End Time": new Date(booking.end_time).toLocaleTimeString(),
        Description: booking.description || "-",
        "User ID": booking.user_id,
      };
    });

    const ws = XLSX.utils.json_to_sheet(bookingsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    XLSX.writeFile(
      wb,
      `bookings-${new Date().toISOString().split("T")[0]}.xlsx`
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
      Export to Excel
    </Button>
  );
}
