import z from "zod";

export const createCouponZodSchema = z
  .object({
    code: z
      .string({ error: "Code is required" })
      .min(3, "Code must be at least 3 characters"),
    discountType: z.enum(["percentage", "fixed"], {
      error: "Discount type is required",
    }),
    discountAmount: z.coerce
      .number({ error: "Discount amount is required" })
      .positive("Must be a positive number"),
    minOrderValue: z.coerce.number().min(0, "Must be 0 or more").optional(),
    expiryDate: z.string({ error: "Expiry date is required" }).min(1, "Expiry date is required"),
    usageLimit: z.coerce
      .number({ error: "Usage limit is required" })
      .int()
      .positive("Must be a positive integer"),
    isActive: z.boolean().optional().default(true),
    hasPerUserLimit: z.boolean().optional().default(false),
    perUserUsageLimit: z.coerce
      .number()
      .int()
      .positive("Must be a positive integer")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.hasPerUserLimit && !data.perUserUsageLimit) return false;
      return true;
    },
    {
      message: "Per-user usage limit is required when per-user limit is enabled",
      path: ["perUserUsageLimit"],
    },
  );

export type CreateCouponFormInput = z.input<typeof createCouponZodSchema>;
export type CreateCouponFormData = z.infer<typeof createCouponZodSchema>;
