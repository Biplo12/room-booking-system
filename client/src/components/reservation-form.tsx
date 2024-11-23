"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "sonner";
import { Reservation, Room } from "@/interfaces";
import { useCreateBooking } from "@/hooks/useBookings";
import { useUserStore } from "@/store/userStore";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  attendees: z.coerce
    .number()
    .min(1, "At least 1 attendee is required")
    .max(50, "Maximum 50 attendees allowed"),
});

interface ReservationFormProps {
  room: Room;
  selectedDate: Date;
  selectedTime: string | null;
}

export function ReservationForm({
  room,
  selectedDate,
  selectedTime,
}: ReservationFormProps) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      attendees: 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedTime || !user) return;

    setIsSubmitting(true);
    try {
      const [hours, minutes] = selectedTime.split(":");
      const start_time = new Date(selectedDate);
      start_time.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const end_time = new Date(start_time);
      end_time.setHours(start_time.getHours() + 1);

      await createBooking.mutateAsync({
        room_id: room.id,
        start_time,
        end_time,
        title: values.title,
        description: values.description || "",
      });

      toast.success("Room booked successfully!");
      router.push(`/book/${room.id}/success`);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to book the room. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meeting Title</FormLabel>
              <FormControl>
                <Input placeholder="Team Standup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Meeting agenda and notes..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Attendees</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value === "" ? "0" : e.target.value;
                    field.onChange(value);
                  }}
                  min={1}
                  max={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Selected Date:</span>
            <span className="ml-2 text-muted-foreground">
              {format(selectedDate, "PPP")}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Selected Time:</span>
            <span className="ml-2 text-muted-foreground">
              {selectedTime || "Please select a time"}
            </span>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!selectedTime || isSubmitting}
        >
          {isSubmitting ? "Booking..." : "Confirm Booking"}
        </Button>
      </form>
    </Form>
  );
}
