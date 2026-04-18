import z from "zod";
import { PhoneNumberSchema } from "@/lib/phoneNumberValidation";

export const checkoutSchema = z.object({
  firstName: z.string({ message: "First name is required" }).min(2, "First name must be at least 2 characters"),
  lastName: z.string({ message: "Last name is required" }).min(2, "Last name must be at least 2 characters"),
  streetAddress: z
    .string({ message: "Street address is required" })
    .min(5, "Street address must be at least 5 characters"),
  city: z.string({ message: "City is required" }).min(2, "City is required"),
  district: z.string({ message: "District is required" }).min(2, "District is required"),
  postcode: z.string().optional(),
  phone: PhoneNumberSchema,
  orderNotes: z.string().optional(),
  shippingMethod: z.string({ message: "Please select a shipping method" }),
  paymentMethod: z.enum(["cod", "online"], {
    message: "Please select a payment method",
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Conditions",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
