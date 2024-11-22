import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingTrendsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Booking Trends</CardTitle>
        <CardDescription>Number of bookings per day this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <Skeleton className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}
