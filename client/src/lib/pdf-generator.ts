import { Reservation } from "@/interfaces";
import { jsPDF } from "jspdf";

export function generatePDF(booking: Reservation) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(20);
  doc.text("Booking Confirmation", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text("Meeting Details", 20, 40);

  const details = [
    `Title: ${booking.title}`,
    `Date: ${new Date(booking.start_time).toLocaleDateString()}`,
    `Time: ${new Date(booking.start_time).toLocaleTimeString()} - ${new Date(
      booking.end_time
    ).toLocaleTimeString()}`,
    `Room ID: ${booking.room_id}`,
    `Booking Reference: ${booking.id}`,
  ];

  if (booking.description) {
    details.push(`Description: ${booking.description}`);
  }

  details.forEach((detail, index) => {
    doc.text(detail, 20, 55 + index * 10);
  });

  doc.setFontSize(10);
  doc.text("Conference Room Booking System", pageWidth / 2, 280, {
    align: "center",
  });

  doc.save(`booking-confirmation-${booking.id}.pdf`);
}
