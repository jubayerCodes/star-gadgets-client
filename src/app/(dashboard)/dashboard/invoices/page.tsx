import DashboardHeader from "@/components/dashboard/dashboard-header";
import { IconReceipt2 } from "@tabler/icons-react";

const InvoicesPage = () => {
  return (
    <div>
      <DashboardHeader title="Invoices" description="View and manage customer invoices" />
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <IconReceipt2 className="size-12 mb-4 opacity-40" />
        <p className="text-base font-medium">Invoice generation coming soon</p>
        <p className="text-sm mt-1 opacity-70">Invoices will be automatically generated when orders are placed.</p>
      </div>
    </div>
  );
};

export default InvoicesPage;
