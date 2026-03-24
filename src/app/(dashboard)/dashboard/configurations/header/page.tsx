import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import HeaderConfigForm from "@/features/config/header/form/header-config-form";
import { Suspense } from "react";

function HeaderConfigPage() {
  return (
    <div>
      <DashboardHeader title="Header Configurations" description="Manage your header configurations"></DashboardHeader>
      <Suspense fallback={<Loading />}>
        <HeaderConfigForm />
      </Suspense>
    </div>
  );
}

export default HeaderConfigPage;
