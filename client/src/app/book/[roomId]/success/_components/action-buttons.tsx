import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ActionButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => router.push("/user")}
      >
        <Calendar className="h-4 w-4" />
        View My Bookings
      </Button>
      <Button
        className="flex items-center gap-2"
        onClick={() => router.push("/")}
      >
        Book Another Room
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
