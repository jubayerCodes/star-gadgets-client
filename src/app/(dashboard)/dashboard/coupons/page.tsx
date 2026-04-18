import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import CreateCouponModal from "@/features/coupons/components/modals/create-coupon-modal";
import CouponsFilter from "@/features/coupons/components/table/coupons-filter";
import CouponsTable from "@/features/coupons/components/table/coupons-table";
import { Suspense } from "react";

const CouponsPage = () => {
  return (
    <div>
      <DashboardHeader title="Coupons" description="Manage your discount coupons">
        <CreateCouponModal />
      </DashboardHeader>
      <CouponsFilter />
      <Suspense fallback={<Loading />}>
        <CouponsTable />
      </Suspense>
    </div>
  );
};

export default CouponsPage;
