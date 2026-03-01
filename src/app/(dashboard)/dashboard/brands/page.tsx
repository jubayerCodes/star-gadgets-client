import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import CreateBrandModal from "@/features/brands/components/models/createBrandModal";
import UpdateBrandModal from "@/features/brands/components/models/updateBrandModal";
import BrandsTable from "@/features/brands/components/table/BrandsTable";
import { Suspense } from "react";

const Brands = () => {
  return (
    <div>
      <DashboardHeader title="Brands" description="Manage your brands">
        <CreateBrandModal />
        <UpdateBrandModal />
      </DashboardHeader>
      <Suspense fallback={<Loading />}>
        <BrandsTable />
      </Suspense>
    </div>
  );
};

export default Brands;
