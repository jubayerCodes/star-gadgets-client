"use client";

import { DataTable } from "@/components/data-table";
import { IProductAdmin } from "../../types/product.types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled, IconEdit, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { productsAdminQueryOptions, useDeleteProductMutation } from "../../hooks/useProducts";
import { useRouter, useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

const ProductsTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data } = useSuspenseQuery(productsAdminQueryOptions(searchParams));
  const { mutateAsync: deleteProduct } = useDeleteProductMutation();

  const columns: ColumnDef<IProductAdmin>[] = [
    {
      accessorKey: "featuredImage",
      header: "",
      size: 40,
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.featuredImage || placeholder.src}
            alt={row.original.title}
            width={40}
            height={40}
            className="object-contain size-10 rounded"
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Name",
      meta: {
        sortable: true,
      },
    },
    {
      accessorKey: "productCode",
      header: "Product Code",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => <span>{row.original.categoryId?.title ?? "—"}</span>,
    },
    {
      accessorKey: "subCategoryId",
      header: "Sub Category",
      cell: ({ row }) => <span>{row.original.subCategoryId?.title ?? "—"}</span>,
    },
    {
      accessorKey: "brandId",
      header: "Brand",
      cell: ({ row }) => <span>{row.original.brandId?.title ?? "—"}</span>,
    },
    {
      accessorKey: "priceRange",
      header: "Price Range",
      meta: {
        align: "center",
        headerAlign: "center",
        sortable: true,
      },
      cell: ({ row }) => {
        const price = row.original.priceRange;
        return (
          <span>{typeof price === "number" ? `৳${price.toLocaleString()}` : `৳${price.min} - ৳${price.max}`}</span>
        );
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      meta: {
        align: "center",
        headerAlign: "center",
        sortable: true,
      },
      cell: ({ row }) => <span>{row.original.stock ?? 0}</span>,
    },
    {
      accessorKey: "variants",
      header: "Variants",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => <span>{row.original.variants?.length ?? 0}</span>,
    },
    {
      accessorKey: "isActive",
      header: "Active",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => <span>{row.original.isActive ? <IconCircleCheckFilled className="text-accent" /> : ""}</span>,
    },
    {
      accessorKey: "",
      header: "Actions",
      cell: ({ row }) => {
        const actions: DataTableOption[] = [
          {
            label: "Edit",
            icon: IconEdit,
            onClick: () => {
              router.push(`/dashboard/products/${row.original._id}`);
            },
          },
          {
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: () => {
              const { openModal } = useDeleteModalStore.getState();
              openModal({
                title: "Delete Product",
                description: "Are you sure you want to delete this product? This action cannot be undone.",
                onConfirm: async () => {
                  await deleteProduct(row.original._id);
                },
              });
            },
          },
        ];

        return <DataTableAction options={actions} />;
      },
    },
  ];

  return <DataTable columns={columns} data={data?.data || []} meta={data?.meta} />;
};

export default ProductsTable;
