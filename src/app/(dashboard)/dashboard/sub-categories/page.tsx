"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import CreateSubCategoryModal from "@/features/sub-categories/components/modal/create-sub-category-modal";
import SubCategoriesTable from "@/features/sub-categories/components/table/sub-categories-table";
import { Suspense } from "react";

function SubCategoriesPage() {
  return (
    <div>
      <DashboardHeader title="All Sub Categories" description="Manage your sub categories">
        <CreateSubCategoryModal />
      </DashboardHeader>
      <Suspense fallback={<Loading />}>
        <SubCategoriesTable />
      </Suspense>
    </div>
  );
}

export default SubCategoriesPage;
