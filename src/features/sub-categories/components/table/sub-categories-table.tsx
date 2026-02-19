import { DataTable } from "@/components/data-table";
import { FC } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { ISubCategoryAdmin } from "../../types";

export interface SubCategoriesTableProps {
  data: ISubCategoryAdmin[];
}

const SubCategoriesTable: FC<SubCategoriesTableProps> = ({ data }) => {
  const columns: ColumnDef<ISubCategoryAdmin>[] = [
    {
      accessorKey: "image",
      header: "",
      size: 40,
      cell: ({ row }) => {
        return (
          <Image
            src={row.original.image}
            alt={row.original.title}
            width={40}
            height={40}
            className="object-contain size-10"
            onError={(e) => (e.currentTarget.src = placeholder.src)}
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
      accessorKey: "description",
      header: "Description",
      minSize: 200,
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
      cell: ({}) => {
        const actions: DataTableOption[] = [
          {
            label: "Edit",
            icon: IconPencil,
            onClick() {},
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

  return <DataTable columns={columns} data={data} />;
};

export default SubCategoriesTable;
