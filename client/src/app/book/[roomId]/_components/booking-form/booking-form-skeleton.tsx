import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Room</CardTitle>
        <CardDescription>Complete your reservation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Fields */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}

        {/* Submit Button */}
        <Skeleton className="h-10 w-full mt-6" />
      </CardContent>
    </Card>
  );
}
