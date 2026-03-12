import DashboardHeader from "@/components/dashboard/dashboard-header";
import { AddProductForm } from "@/features/products/components/form/add-product-form";

function AddProductPage() {
  return (
    <div>
      <DashboardHeader title="Add Product" description="Add new product"></DashboardHeader>
      <AddProductForm />
    </div>
  );
}

export default AddProductPage;
