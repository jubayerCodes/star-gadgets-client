import { Suspense } from "react";
import Loading from "@/components/layout/loading";
import OrderDetailContent from "./order-detail-content";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AccountOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense fallback={<Loading />}>
      <OrderDetailContent id={id} />
    </Suspense>
  );
}
