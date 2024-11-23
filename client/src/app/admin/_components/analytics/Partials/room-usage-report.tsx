import { useBookingStore } from "@/store/bookingStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RoomUsageReport() {
  const { rooms, reservations } = useBookingStore();

  const roomUsageStats = rooms.map((room) => {
    const roomReservations = reservations.filter(
      (res) => res.room_id === room.id
    );

    return {
      id: room.id,
      name: room.name,
      totalBookings: roomReservations.length,
      totalHours: roomReservations.reduce((acc, res) => {
        const duration =
          new Date(res.end_time).getTime() - new Date(res.start_time).getTime();
        return acc + duration / (1000 * 60 * 60); // Conversion to hours
      }, 0),
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Usage Report</CardTitle>
        <CardDescription>
          Detailed usage statistics for each room
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Name</TableHead>
              <TableHead>Total Bookings</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Average Hours/Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roomUsageStats.map((stat) => (
              <TableRow key={stat.id}>
                <TableCell>{stat.name}</TableCell>
                <TableCell>{stat.totalBookings}</TableCell>
                <TableCell>{stat.totalHours.toFixed(1)}</TableCell>
                <TableCell>
                  {stat.totalBookings > 0
                    ? (stat.totalHours / stat.totalBookings).toFixed(1)
                    : "0"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
