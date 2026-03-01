import z from "zod";

export const createBrandZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(50, "Slug must be at most 50 characters long"),
  featured: z.boolean().optional(),
});

export const updateBrandZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters long")
    .optional(),
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(50, "Slug must be at most 50 characters long")
    .optional(),
  featured: z.boolean().optional(),
});

export type CreateBrandFormData = z.infer<typeof createBrandZodSchema>;
export type UpdateBrandFormData = z.infer<typeof updateBrandZodSchema>;
