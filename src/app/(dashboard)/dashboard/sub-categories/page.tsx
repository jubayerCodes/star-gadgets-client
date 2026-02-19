"use client";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import CreateSubCategoryModal from "@/features/sub-categories/components/modal/create-sub-category-modal";
import SubCategoriesTable from "@/features/sub-categories/components/table/sub-categories-table";
import { subCategoriesAdminQueryOptions } from "@/features/sub-categories/hooks/useSubCategory";
import { useSuspenseQuery } from "@tanstack/react-query";

function SubCategoriesPage() {
  const { data } = useSuspenseQuery(subCategoriesAdminQueryOptions());

  const subCategories = data?.data || [];

  return (
    <div>
      <DashboardHeader title="All Sub Categories" description="Manage your sub categories">
        <CreateSubCategoryModal />
      </DashboardHeader>
      <SubCategoriesTable data={subCategories} />
    </div>
  );
}

export default SubCategoriesPage;
