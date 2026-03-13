import { z } from "zod";
import { ProductStatus } from "../types/product.types";

export const productAttributeZodSchema = z.object({
  name: z.string({ error: "Attribute name is required" }).min(1, "Name is required"),
  values: z
    .array(z.string({ error: "Attribute value must be a string" }))
    .min(1, "At least one attribute value is required"),
});

export const variantAttributeZodSchema = z.object({
  name: z.string().optional().default(""),
  value: z.string().optional().default(""),
});

export const variantZodSchema = z.object({
  // Variant attributes are optional — empty array is valid
  attributes: z.array(variantAttributeZodSchema).optional().default([]),
  price: z.coerce.number({ error: "Price is required" }).nonnegative("Price must be a non-negative number").optional(),
  regularPrice: z.coerce
    .number({ error: "Regular price is required" })
    .nonnegative("Regular price must be a non-negative number"),
  stock: z.coerce
    .number({ error: "Stock is required" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number"),
  status: z.nativeEnum(ProductStatus, {
    error: "Invalid product status",
  }),
  sku: z.string({ error: "SKU is required" }).min(1, "SKU is required"),
  images: z
    .array(z.string({ error: "Image must be a string" }))
    .min(1, "At least one image is required"),
  featuredImage: z.string({ error: "Featured image is required" }).min(1, "Featured image is required"),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const specificationZodSchema = z.object({
  heading: z.string({ error: "Specification heading is required" }).min(1, "Heading is required"),
  specifications: z
    .array(
      z.object({
        name: z.string({ error: "Specification name is required" }).min(1, "Name is required"),
        value: z.string({ error: "Specification value is required" }).min(1, "Value is required"),
      }),
    )
    .min(1, "At least one specification is required"),
});

export const createProductZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(200, "Title must be at most 200 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(200, "Slug must be at most 200 characters long"),
  featuredImage: z.string({ error: "Featured image is required" }).min(1, "Featured image is required"),
  subCategoryId: z.string({ error: "Sub-category ID is required" }).min(1, "Sub-category ID is required"),
  brandId: z.string({ error: "Brand ID is required" }).min(1, "Brand ID is required"),
  categoryId: z.string({ error: "Category ID is required" }).min(1, "Category ID is required"),
  productCode: z.string({ error: "Product code is required" }).min(1, "Product code is required"),
  keyFeatures: z.string({ error: "Key features are required" }).min(1, "Key features are required"),
  specifications: z.array(specificationZodSchema).min(1, "At least one specification group is required"),
  description: z.string({ error: "Description is required" }).min(1, "Description is required"),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  // Top-level attributes are optional — a product may have no attribute groups
  attributes: z.array(productAttributeZodSchema).optional().default([]),
  variants: z.array(variantZodSchema).min(1, "At least one variant is required"),
});

export type CreateProductFormData = z.infer<typeof createProductZodSchema>;
