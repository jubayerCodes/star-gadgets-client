import z from "zod";

export const createCategoryZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(50, "Slug must be at most 50 characters long"),
  image: z.string().min(1, "Image is required"),
  featured: z.boolean().optional(),
});

export const updateCategoryZodSchema = z.object({
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
  image: z.string().optional(),
  featured: z.boolean().optional(),
});

export type CreateCategoryFormData = z.infer<typeof createCategoryZodSchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategoryZodSchema>;
