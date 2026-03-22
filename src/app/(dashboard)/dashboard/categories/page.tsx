import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import CreateCategoryModal from "@/features/categories/components/modals/create-category-modal";
import UpdateCategoryModal from "@/features/categories/components/modals/update-category-modal";
import CategoriesFilter from "@/features/categories/components/table/categories-filter";
import CategoriesTable from "@/features/categories/components/table/categories-table";
import { Suspense } from "react";

const Categories = () => {
  return (
    <div>
      <DashboardHeader title="All Categories" description="Manage your categories">
        <CreateCategoryModal />
        <UpdateCategoryModal />
      </DashboardHeader>
      <Suspense fallback={null}>
        <CategoriesFilter />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <CategoriesTable />
      </Suspense>
    </div>
  );
};

export default Categories;
