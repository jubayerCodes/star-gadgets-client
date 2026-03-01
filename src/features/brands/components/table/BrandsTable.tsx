"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IBrand } from "../../types";
import Image from "next/image";
import { brandsAdminQueryOptions, useDeleteBrandMutation } from "../../hooks/useBrands";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { DataTable } from "@/components/data-table";
import { useUpdateBrandStore } from "../../store/useUpdateBrandStore";

const BrandsTable = () => {
  const { mutateAsync: deleteBrand } = useDeleteBrandMutation();
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery(brandsAdminQueryOptions(searchParams));

  const columns: ColumnDef<IBrand>[] = [
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
              const { openModal } = useUpdateBrandStore.getState();
              openModal({ brand: row.original });
            },
          },
          {
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: () => {
              const { openModal } = useDeleteModalStore.getState();
              openModal({
                title: "Delete Brand",
                description: "Are you sure you want to delete this brand?",
                onConfirm: async () => {
                  await deleteBrand(row.original._id);
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

export default BrandsTable;
