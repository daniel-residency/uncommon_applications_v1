import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const answersSchema = z.record(z.string(), z.string());

export const matchRequestSchema = z.object({
  applicationId: z.string().uuid(),
});

export const homeSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(1),
  logo_url: z.string().nullable().optional(),
  location: z.string().min(1),
  description_template: z.string().min(1),
  matching_prompt: z.string().min(1),
  question: z.string().nullable().optional(),
  video_url: z.string().nullable().optional(),
  active: z.boolean().optional(),
  display_order: z.number().int().optional(),
});

export const adminLoginSchema = z.object({
  secret: z.string().min(1),
});
