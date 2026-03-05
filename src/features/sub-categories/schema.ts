import z from "zod";

export const createSubCategoryZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title is required")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(1, "Slug is required")
    .max(50, "Slug must be at most 50 characters long"),
  featured: z.boolean().optional(),
  categoryId: z.string({ error: "Category is required" }).min(1, "Category is required"),
});

export const updateSubCategoryZodSchema = z.object({
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
  categoryId: z.string({ error: "Category is required" }).min(1, "Category is required"),
});

export type CreateSubCategoryFormData = z.infer<typeof createSubCategoryZodSchema>;
export type UpdateSubCategoryFormData = z.infer<typeof updateSubCategoryZodSchema>;
