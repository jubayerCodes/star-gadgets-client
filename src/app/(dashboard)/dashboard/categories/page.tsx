"use client";

import DashboardButton from "@/components/dashboard/dashboard-button";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import CategoriesTable from "@/features/categories/components/table/categories-table";
import { categoriesAdminQueryOptions } from "@/features/categories/hooks/useCategories";
import { useSuspenseQuery } from "@tanstack/react-query";

const Categories = () => {
  const { data } = useSuspenseQuery(categoriesAdminQueryOptions());

  const categories = data?.data || [];

  return (
    <div>
      <DashboardHeader title="All Categories" description="Manage your categories">
        <DashboardButton>Add Category</DashboardButton>
      </DashboardHeader>
      <CategoriesTable data={categories} />
    </div>
  );
};

export default Categories;
