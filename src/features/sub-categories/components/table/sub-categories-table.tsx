import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { ISubCategoryAdmin } from "../../types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { subCategoriesAdminQueryOptions } from "../../hooks/useSubCategory";
import { useSearchParams } from "next/navigation";
import { useUpdateSubCategoryStore } from "../../store/useUpdateSubCategoryStore";

const SubCategoriesTable = () => {
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery(subCategoriesAdminQueryOptions(searchParams));

  const columns: ColumnDef<ISubCategoryAdmin>[] = [
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        return <span>{row.original.categoryId?.title}</span>;
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
        return <span>{featured ? <IconCircleCheckFilled className="text-accent" /> : ""}</span>;
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
              const { openModal } = useUpdateSubCategoryStore.getState();
              openModal({ subCategory: row.original });
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
                onConfirm: async () => {},
              });
            },
          },
        ];

        return <DataTableAction options={actions} />;
      },
    },
  ];

  return <DataTable meta={data?.meta} columns={columns} data={data?.data || []} />;
};

export default SubCategoriesTable;
