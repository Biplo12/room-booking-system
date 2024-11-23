"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
  return (
    <div className="group rounded-lg border bg-card overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48" />

      <div className="p-6 space-y-4">
        {/* Title and capacity skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>

        {/* Equipment skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Availability skeleton */}
        <Skeleton className="h-4 w-1/3" />

        {/* Button skeleton */}
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
