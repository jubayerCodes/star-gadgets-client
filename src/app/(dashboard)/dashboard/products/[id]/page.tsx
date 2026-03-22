import DashboardHeader from "@/components/dashboard/dashboard-header";
import { UpdateProductForm } from "@/features/products/components/form/update-product-form";

interface UpdateProductPageProps {
  params: Promise<{ id: string }>;
}

async function UpdateProductPage({ params }: UpdateProductPageProps) {
  const { id } = await params;

  return (
    <div>
      <DashboardHeader title="Update Product" description="Update existing product"></DashboardHeader>
      <UpdateProductForm productId={id} />
    </div>
  );
}

export default UpdateProductPage;
