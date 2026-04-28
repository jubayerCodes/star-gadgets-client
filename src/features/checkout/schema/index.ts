import z from "zod";
import { PhoneNumberSchema } from "@/lib/phoneNumberValidation";

const addressFields = {
  firstName: z.string({ message: "First name is required" }).min(2, "First name must be at least 2 characters"),
  lastName: z.string({ message: "Last name is required" }).min(2, "Last name must be at least 2 characters"),
  streetAddress: z
    .string({ message: "Street address is required" })
    .min(5, "Street address must be at least 5 characters"),
  city: z.string({ message: "City is required" }).min(2, "City is required"),
  district: z.string({ message: "District is required" }).min(2, "District is required"),
  postcode: z.string().optional(),
  phone: PhoneNumberSchema,
};

export const checkoutSchema = z
  .object({
    // ── Billing Details ───────────────────────────────────────────────────
    ...addressFields,
    email: z.string({ message: "Email is required" }).email("Please enter a valid email"),

    // ── Ship to different address toggle ──────────────────────────────────
    shipToDifferentAddress: z.boolean().optional(),

    // ── Shipping address fields (prefixed with shipping_) ─────────────────
    shipping_firstName: z.string().optional(),
    shipping_lastName: z.string().optional(),
    shipping_streetAddress: z.string().optional(),
    shipping_city: z.string().optional(),
    shipping_district: z.string().optional(),
    shipping_postcode: z.string().optional(),
    shipping_phone: z.string().optional(),

    // ── Order options ─────────────────────────────────────────────────────
    orderNotes: z.string().optional(),
    shippingMethod: z.string({ message: "Please select a shipping method" }),
    paymentMethod: z.enum(["cod", "online"], {
      message: "Please select a payment method",
    }),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Terms and Conditions",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.shipToDifferentAddress) return;

    // When ship-to-different-address is checked, validate all shipping fields
    if (!data.shipping_firstName || data.shipping_firstName.length < 2) {
      ctx.addIssue({ code: "custom", path: ["shipping_firstName"], message: "First name must be at least 2 characters" });
    }
    if (!data.shipping_lastName || data.shipping_lastName.length < 2) {
      ctx.addIssue({ code: "custom", path: ["shipping_lastName"], message: "Last name must be at least 2 characters" });
    }
    if (!data.shipping_streetAddress || data.shipping_streetAddress.length < 5) {
      ctx.addIssue({ code: "custom", path: ["shipping_streetAddress"], message: "Street address must be at least 5 characters" });
    }
    if (!data.shipping_city || data.shipping_city.length < 2) {
      ctx.addIssue({ code: "custom", path: ["shipping_city"], message: "City is required" });
    }
    if (!data.shipping_district || data.shipping_district.length < 2) {
      ctx.addIssue({ code: "custom", path: ["shipping_district"], message: "District is required" });
    }
    if (!data.shipping_phone || data.shipping_phone.length < 5) {
      ctx.addIssue({ code: "custom", path: ["shipping_phone"], message: "Phone is required" });
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
