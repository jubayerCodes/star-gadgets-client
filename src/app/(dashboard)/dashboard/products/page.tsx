import DashboardButton from "@/components/dashboard/dashboard-button";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Loading from "@/components/layout/loading";
import ProductsFilter from "@/features/products/components/table/products-filter";
import ProductsTable from "@/features/products/components/table/products-table";
import Link from "next/link";
import { Suspense } from "react";

const Products = () => {
  return (
    <div>
      <DashboardHeader title="All Products" description="Manage your products">
        <Link href="/dashboard/products/add">
          <DashboardButton>Add Product</DashboardButton>
        </Link>
      </DashboardHeader>
      <Suspense>
        <ProductsFilter />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <ProductsTable />
      </Suspense>
    </div>
  );
};

export default Products;

