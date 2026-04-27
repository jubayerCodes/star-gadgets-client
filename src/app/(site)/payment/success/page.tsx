import { Suspense } from "react";
import PaymentSuccessContent from "./payment-success-content";
import Loading from "@/components/layout/loading";

export const metadata = {
  title: "Payment Successful – Star Gadgets",
};

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
