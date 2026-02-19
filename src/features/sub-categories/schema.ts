import z from "zod";

export const createSubCategoryZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(50, "Slug must be at most 50 characters long"),
  featured: z.boolean().optional(),
  categoryId: z.string({ error: "Category ID is required" }),
});

export type CreateSubCategoryFormData = z.infer<typeof createSubCategoryZodSchema>;
