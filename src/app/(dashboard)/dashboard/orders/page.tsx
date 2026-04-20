import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import OrdersTable from "@/features/checkout/components/table/orders-table";
import UpdateOrderStatusModal from "@/features/checkout/components/modals/update-order-status-modal";
import { Suspense } from "react";

const OrdersPage = () => {
  return (
    <div>
      <DashboardHeader title="Orders" description="Manage all customer orders" />
      <Suspense fallback={<Loading />}>
        <OrdersTable />
      </Suspense>
      <UpdateOrderStatusModal />
    </div>
  );
};

export default OrdersPage;
