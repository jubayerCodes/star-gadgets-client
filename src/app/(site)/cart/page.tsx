import CartContent from "@/features/cart/components/cart-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Star Gadgets",
  description:
    "Review your selected items, adjust quantities, and proceed to checkout at Star Gadgets.",
};

export default function CartPage() {
  return <CartContent />;
}
