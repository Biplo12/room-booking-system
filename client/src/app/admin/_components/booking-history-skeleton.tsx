import { Skeleton } from "@/components/ui/skeleton";

export function BookingHistorySkeleton() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Booking History</h2>
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {["Room", "User", "Date", "Time", "Status"].map((header) => (
                <th key={header} className="px-4 py-3 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-28" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
