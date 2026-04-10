import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import CreateBadgeModal from "@/features/badges/components/modals/createBadgeModal";
import UpdateBadgeModal from "@/features/badges/components/modals/updateBadgeModal";
import BadgesFilter from "@/features/badges/components/table/badges-filter";
import BadgesTable from "@/features/badges/components/table/BadgesTable";
import { Suspense } from "react";

const BadgesPage = () => {
  return (
    <div>
      <DashboardHeader title="Badges" description="Manage product badges">
        <CreateBadgeModal />
        <UpdateBadgeModal />
      </DashboardHeader>
      <Suspense fallback={null}>
        <BadgesFilter />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <BadgesTable />
      </Suspense>
    </div>
  );
};

export default BadgesPage;
