import { Skeleton } from "@/components/ui/skeleton";

const NUM_SKELETONS = 3;

export function StatsOverviewSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: NUM_SKELETONS }).map((_, index) => (
        <div key={index} className="p-6 rounded-lg border bg-card">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
