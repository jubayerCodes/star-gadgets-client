"use client";

import { DataTable } from "@/components/data-table";
import { ICategoryAdmin } from "../../types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useUpdateCategoryStore } from "../../store/updateCategoryStore";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { categoriesAdminQueryOptions, useDeleteCategoryMutation } from "../../hooks/useCategories";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

const CategoriesTable = () => {
  const { mutateAsync: deleteCategory } = useDeleteCategoryMutation();
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery(categoriesAdminQueryOptions(searchParams));

  const columns: ColumnDef<ICategoryAdmin>[] = [
    {
      accessorKey: "image",
      header: "",
      size: 40,
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.image || placeholder.src}
            alt={row.original.title}
            width={40}
            height={40}
            className="object-contain size-10"
          />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "subCategories",
      header: "Sub Categories",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => {
        return <span>{row.original.subCategoriesCount}</span>;
      },
    },
    {
      accessorKey: "featured",
      header: "Featured",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => {
        const featured = row.original.featured;
        return <span>{featured ? <IconCircleCheckFilled className="text-green-700" /> : ""}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const actions: DataTableOption[] = [
          {
            label: "Edit",
            icon: IconPencil,
            onClick() {
              const { openModal } = useUpdateCategoryStore.getState();
              openModal({ category: row.original });
            },
          },
          {
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: () => {
              const { openModal } = useDeleteModalStore.getState();
              openModal({
                title: "Delete Category",
                description: "Are you sure you want to delete this category?",
                onConfirm: async () => {
                  await deleteCategory(row.original._id);
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

export default CategoriesTable;
