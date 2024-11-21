import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  capacity: z.string().min(1, "Capacity is required"),
  location: z.string().min(1, "Location is required"),
  equipment: z.string(),
});

export type FormSchema = z.infer<typeof formSchema>;
