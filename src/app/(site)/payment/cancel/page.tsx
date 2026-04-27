import { Suspense } from "react";
import PaymentCancelContent from "./payment-cancel-content";
import Loading from "@/components/layout/loading";

export const metadata = {
  title: "Payment Cancelled – Star Gadgets",
};

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
