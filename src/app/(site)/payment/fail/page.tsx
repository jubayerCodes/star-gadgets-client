import { Suspense } from "react";
import PaymentFailContent from "./payment-fail-content";
import Loading from "@/components/layout/loading";

export const metadata = {
  title: "Payment Failed – Star Gadgets",
};

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentFailContent />
    </Suspense>
  );
}
