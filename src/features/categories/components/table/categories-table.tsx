import { DataTable } from "@/components/data-table";
import { ICategoryWithSubCategories } from "../../types";
import { FC } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import placeholder from "@/assets/img/placeholder.png";
import { IconCircleCheckFilled } from "@tabler/icons-react";

export interface CategoriesTableProps {
  data: ICategoryWithSubCategories[];
}

const CategoriesTable: FC<CategoriesTableProps> = ({ data }) => {
  const columns: ColumnDef<ICategoryWithSubCategories>[] = [
    {
      accessorKey: "image",
      header: "",
      size: 50,
      cell: ({ row }) => {
        return (
          <Image
            src={placeholder}
            alt={row.original.title}
            width={50}
            height={50}
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
        return <span>{featured ? <IconCircleCheckFilled /> : ""}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
    },
  ];

  return <DataTable columns={columns} data={data} />;
};

export default CategoriesTable;
