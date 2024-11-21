import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reservation } from "@/interfaces";

interface BookingTrendsProps {
  reservations: Reservation[];
}

export function BookingTrends({ reservations }: BookingTrendsProps) {
  const chartData = eachDayOfInterval({
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  }).map((day) => ({
    date: format(day, "MMM dd"),
    bookings: reservations.filter(
      (res) => format(res.startTime, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    ).length,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Booking Trends</CardTitle>
        <CardDescription>Number of bookings per day this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--background))" }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
