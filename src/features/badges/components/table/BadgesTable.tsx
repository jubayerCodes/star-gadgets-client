"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IBadge } from "../../types";
import { badgesAdminQueryOptions, useDeleteBadgeMutation } from "../../hooks/useBadges";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { IconCircleCheckFilled, IconPencil, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { DataTable } from "@/components/data-table";
import { useUpdateBadgeStore } from "../../store/useUpdateBadgeStore";

const BadgesTable = () => {
  const { mutateAsync: deleteBadge } = useDeleteBadgeMutation();
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery(badgesAdminQueryOptions(searchParams));

  const columns: ColumnDef<IBadge>[] = [
    {
      accessorKey: "title",
      header: "Title",
      meta: {
        sortable: true,
        sortKey: "title",
      },
    },
    {
      accessorKey: "editable",
      header: "Editable",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => (
        <span>{row.original.editable ? <IconCircleCheckFilled className="text-accent" /> : ""}</span>
      ),
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
              const { openModal } = useUpdateBadgeStore.getState();
              openModal({ badge: row.original });
            },
          },
          {
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: () => {
              const { openModal } = useDeleteModalStore.getState();
              openModal({
                title: "Delete Badge",
                description: "Are you sure you want to delete this badge? This action cannot be undone.",
                onConfirm: async () => {
                  await deleteBadge(row.original._id);
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

export default BadgesTable;
