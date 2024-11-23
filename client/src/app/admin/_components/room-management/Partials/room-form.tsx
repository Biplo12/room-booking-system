"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema } from "../types";
import { Room } from "@/interfaces";
import { z } from "zod";

interface RoomFormProps {
  onSubmit: (values: FormSchema) => void;
  room?: Room | null;
}

export function RoomForm({ onSubmit, room }: RoomFormProps) {
  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    location: z.string().min(1, "Location is required"),
    equipment: z.string().optional(),
    image_url: z.string().optional(),
  });

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room?.name || "",
      capacity: Number(room?.capacity) || 0,
      location: room?.location || "",
      equipment: room?.equipment || "",
      image_url: room?.image_url || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Conference Room A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Floor 1, Building A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Projector, Whiteboard, Video conferencing"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">{room ? "Update Room" : "Add Room"}</Button>
        </div>
      </form>
    </Form>
  );
}
