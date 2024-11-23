import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  location: z.string().min(1, "Location is required"),
  equipment: z.array(z.string()),
  image_url: z.string().optional(),
});

export type FormSchema = z.infer<typeof formSchema>;
