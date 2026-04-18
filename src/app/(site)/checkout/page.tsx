import CheckoutContent from "@/features/checkout/components/checkout-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Star Gadgets",
  description:
    "Complete your purchase securely. Enter your billing details, choose a shipping method, and place your order.",
};

export default function CheckoutPage() {
  return <CheckoutContent />;
}
