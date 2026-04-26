"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IOrder, OrderStatus } from "@/features/checkout/types";
import { useAllOrdersQuery } from "@/features/checkout/hooks/useOrders";
import { useUpdateOrderStatusStore } from "@/features/checkout/store/updateOrderStatusStore";
import { DataTable } from "@/components/data-table";
import { DataTableAction, DataTableOption } from "@/components/data-table-action";
import { Badge } from "@/components/ui/badge";
import { IconPencil } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";

const STATUS_VARIANTS: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  CONFIRMED: "default",
  PROCESSING: "default",
  SHIPPED: "outline",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

const PAYMENT_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  UNPAID: "secondary",
  PAID: "default",
  FAILED: "destructive",
  CANCELLED: "outline",
};

const OrdersTable = () => {
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const { data } = useAllOrdersQuery(query);

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-xs">{row.original.orderNumber}</span>
      ),
    },
    {
      accessorKey: "billingDetails",
      header: "Customer",
      cell: ({ row }) => {
        const { firstName, lastName, email } = row.original.billingDetails;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      accessorKey: "items",
      header: "Items",
      meta: { align: "center", headerAlign: "center" },
      cell: ({ row }) => <span>{row.original.items.length}</span>,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => (
        <span className="font-semibold">৳{row.original.total.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "paymentId",
      header: "Payment",
      cell: ({ row }) => {
        const payment = row.original.paymentId;
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className="capitalize text-xs w-fit">
              {payment?.paymentMethod === "cod" ? "COD" : payment?.paymentMethod === "online" ? "Online" : "—"}
            </Badge>
            {payment && (
              <Badge
                variant={PAYMENT_STATUS_VARIANTS[payment.status] ?? "outline"}
                className="capitalize text-xs w-fit"
              >
                {payment.status.toLowerCase()}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={STATUS_VARIANTS[row.original.orderStatus]}
          className="capitalize text-xs"
        >
          {row.original.orderStatus.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const actions: DataTableOption[] = [
          {
            label: "Update Status",
            icon: IconPencil,
            onClick: () => {
              const { openModal } = useUpdateOrderStatusStore.getState();
              openModal({ order: row.original });
            },
          },
        ];
        return <DataTableAction options={actions} />;
      },
    },
  ];

  return <DataTable columns={columns} data={data?.data ?? []} meta={data?.meta} />;
};

export default OrdersTable;
