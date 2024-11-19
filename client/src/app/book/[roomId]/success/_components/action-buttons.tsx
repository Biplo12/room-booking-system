import { Download, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Reservation } from "@/interfaces";
import { generatePDF } from "@/utils/pdf-generator";

interface ActionButtonsProps {
  reservation: Reservation;
}

export function ActionButtons({ reservation }: ActionButtonsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => generatePDF(reservation)}
      >
        <Download className="h-4 w-4" />
        Download PDF
      </Button>
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
