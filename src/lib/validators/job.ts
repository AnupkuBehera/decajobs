import { z } from "zod";

export const jobListingSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be at most 5000 characters"),
  location: z.string().min(1, "Location is required"),
  application_link: z
    .string()
    .url("Application link must be a valid URL"),
});

export type JobListingInput = z.infer<typeof jobListingSchema>;
