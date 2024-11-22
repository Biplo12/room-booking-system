import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  location: z.string().min(1, "Location is required"),
  equipment: z.string().optional(),
  image_url: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
