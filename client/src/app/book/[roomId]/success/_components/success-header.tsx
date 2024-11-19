import { CheckCircle2 } from "lucide-react";

export function SuccessHeader() {
  return (
    <>
      <div className="mb-6">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
      </div>
      <h1 className="text-3xl font-bold mb-4">Reservation Confirmed!</h1>
      <p className="text-muted-foreground mb-8">
        Your room has been successfully booked. You can download the booking
        details by clicking the button below.
      </p>
    </>
  );
}
