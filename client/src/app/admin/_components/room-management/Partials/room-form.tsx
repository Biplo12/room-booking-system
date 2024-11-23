"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { Room } from "@/interfaces";

const equipmentOptions = [
  { label: "Projector", value: "projector" },
  { label: "Whiteboard", value: "whiteboard" },
  { label: "Video Conference", value: "video_conference" },
  { label: "Audio System", value: "audio_system" },
  { label: "Display Screen", value: "display_screen" },
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.string().min(1, "Capacity is required"),
  location: z.string().min(1, "Location is required"),
  equipment: z.array(z.string()).default([]),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  initialData?: Room | null;
  onSubmit: (data: FormValues) => void;
  isSubmitting?: boolean;
}

export function RoomForm({
  initialData,
  onSubmit,
  isSubmitting,
}: RoomFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      capacity: initialData?.capacity?.toString() || "",
      location: initialData?.location || "",
      equipment: initialData?.equipment
        ? typeof initialData.equipment === "string"
          ? initialData.equipment
              .split(",")
              .filter(Boolean)
              .map((item) => item.trim())
          : Array.isArray(initialData.equipment)
          ? initialData.equipment
          : []
        : [],
      image_url: initialData?.image_url || "",
    },
  });

  const formState = form.watch();

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
                <Input placeholder="Room name" {...field} />
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
                <Input type="number" placeholder="Room capacity" {...field} />
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
                <Input placeholder="Room location" {...field} />
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
                <MultiSelect
                  options={equipmentOptions}
                  value={field.value || []}
                  onChange={(newValue) => {
                    field.onChange(newValue);
                    console.log("Equipment Changed:", newValue);
                  }}
                  placeholder="Select equipment..."
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
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Room image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Room"
            : "Create Room"}
        </Button>
      </form>
    </Form>
  );
}
