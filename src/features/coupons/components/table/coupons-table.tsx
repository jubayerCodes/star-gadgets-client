"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ICoupon } from "../../types";
import { couponsAdminQueryOptions, useDeleteCouponMutation } from "../../hooks/useCoupons";
import { IconCircleCheckFilled, IconTrash } from "@tabler/icons-react";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";

const CouponsTable = () => {
  const searchParams = useSearchParams();
  const { data } = useSuspenseQuery(couponsAdminQueryOptions(searchParams));
  const { mutateAsync: deleteCoupon } = useDeleteCouponMutation();

  const columns: ColumnDef<ICoupon>[] = [
    {
      accessorKey: "code",
      header: "Code",
      meta: {
        sortable: true,
        sortKey: "code",
      },
    },
    {
      accessorKey: "discountType",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.discountType}
        </Badge>
      ),
    },
    {
      accessorKey: "discountAmount",
      header: "Discount",
      meta: { sortable: true, sortKey: "discount" },
      cell: ({ row }) => {
        const { discountType, discountAmount } = row.original;
        return (
          <span className="font-medium">
            {discountType === "percentage" ? `${discountAmount}%` : `৳${discountAmount}`}
          </span>
        );
      },
    },
    {
      accessorKey: "minOrderValue",
      header: "Min Order",
      meta: { sortable: true, sortKey: "minOrder" },
      cell: ({ row }) => {
        const val = row.original.minOrderValue;
        return val ? <span>৳{val}</span> : <span className="text-muted-foreground">—</span>;
      },
    },
    {
      accessorKey: "expiryDate",
      header: "Expires",
      cell: ({ row }) => {
        const date = new Date(row.original.expiryDate);
        const isExpired = date < new Date();
        return <span className={isExpired ? "text-destructive" : ""}>{date.toLocaleDateString("en-GB")}</span>;
      },
    },
    {
      accessorKey: "usageLimit",
      header: "Usage",
      meta: {
        align: "center",
        headerAlign: "center",
      },
      cell: ({ row }) => (
        <span>
          {row.original.usedCount} / {row.original.usageLimit}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => (row.original.isActive ? <IconCircleCheckFilled className="text-accent mx-auto" /> : ""),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const actions: DataTableOption[] = [
          {
            label: "Delete",
            icon: IconTrash,
            variant: "destructive",
            onClick: () => {
              const { openModal } = useDeleteModalStore.getState();
              openModal({
                title: "Delete Coupon",
                description: `Are you sure you want to delete coupon "${row.original.code}"?`,
                onConfirm: async () => {
                  await deleteCoupon(row.original._id);
                },
              });
            },
          },
        ];

        return <DataTableAction options={actions} />;
      },
    },
  ];

  return <DataTable columns={columns} data={data.data || []} meta={data.meta} />;
};

export default CouponsTable;
