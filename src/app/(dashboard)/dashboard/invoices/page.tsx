import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Suspense } from "react";
import InvoicesContent from "./invoices-content";
import Loading from "@/components/layout/loading";

const InvoicesPage = () => {
  return (
    <div>
      <DashboardHeader title="Invoices" description="Download and manage customer invoices" />
      <Suspense fallback={<Loading />}>
        <InvoicesContent />
      </Suspense>
    </div>
  );
};

export default InvoicesPage;
