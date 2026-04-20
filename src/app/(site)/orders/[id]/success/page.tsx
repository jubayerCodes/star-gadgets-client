import { Suspense } from "react";
import OrderSuccessContent from "./order-success-content";
import Loading from "@/components/layout/loading";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <OrderSuccessContent id={id} />
    </Suspense>
  );
}
