import { z } from "zod";

/**
 * Zod validation schema for candidate profile data.
 * Validates target titles, skills, location, and optional resume URL.
 *
 * Validates: Requirements 2.1, 2.2, 2.3
 */
export const profileSchema = z.object({
  target_titles: z
    .array(z.string().min(1, { message: "Each target title must not be empty" }))
    .min(1, { message: "At least one target title is required" }),

  skills: z
    .array(z.string().min(1, { message: "Each skill must not be empty" }))
    .min(1, { message: "At least one skill is required" }),

  location: z.string().min(1, { message: "Location is required" }),

  designation: z
    .string()
    .optional()
    .or(z.literal("")),

  expected_salary: z
    .string()
    .optional()
    .or(z.literal("")),

  resume_url: z
    .string()
    .url({ message: "Resume URL must be a valid URL" })
    .optional()
    .or(z.literal("")),
});

/** TypeScript type inferred from the profile validation schema */
export type ProfileInput = z.infer<typeof profileSchema>;
