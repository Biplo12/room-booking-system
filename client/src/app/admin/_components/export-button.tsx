"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useBookingStore } from "@/store/bookingStore";

export function ExportButton() {
  const { rooms, reservations } = useBookingStore();

  const handleExport = () => {
    const bookingsData = reservations.map((booking) => {
      const room = rooms.find((r) => r.id === Number(booking.roomId));
      return {
        "Booking ID": booking.id,
        Room: room?.name || booking.roomId,
        Title: booking.title,
        Date: new Date(booking.startTime).toLocaleDateString(),
        "Start Time": new Date(booking.startTime).toLocaleTimeString(),
        "End Time": new Date(booking.endTime).toLocaleTimeString(),
        Description: booking.description || "-",
        "User ID": booking.userId,
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
    >
      <Download className="h-4 w-4" />
      Export to Excel
    </Button>
  );
}
