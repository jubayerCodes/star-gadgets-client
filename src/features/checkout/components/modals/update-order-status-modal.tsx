"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { useUpdateOrderStatusStore } from "../../store/updateOrderStatusStore";
import { useUpdateOrderStatusMutation } from "../../hooks/useOrders";
import { OrderStatus } from "../../types";

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const UpdateOrderStatusModal = () => {
  const { open, setOpen, order } = useUpdateOrderStatusStore();
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatusMutation();
  const [selected, setSelected] = useState<OrderStatus>(order?.orderStatus ?? "PENDING");

  const handleSubmit = async () => {
    if (!order) return;
    const res = await updateStatus({ id: order._id, orderStatus: selected });
    if (res?.success) {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val && order) setSelected(order.orderStatus);
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Update Order Status</DialogTitle>
          </DialogHeader>

          {order && (
            <p className="text-sm text-muted-foreground">
              Order <span className="font-semibold text-foreground">{order.orderNumber}</span>
            </p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {STATUS_OPTIONS.map((status) => (
              <label
                key={status}
                className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors select-none ${
                  selected === status
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  checked={selected === status}
                  onChange={() => setSelected(status)}
                />
                <span
                  className={`size-4 rounded-full border-2 shrink-0 transition ${
                    selected === status
                      ? "border-primary [box-shadow:inset_0_0_0_3px_oklch(1_0_0),inset_0_0_0_6px_oklch(0.24_0.02_271.82)]"
                      : "border-muted-foreground"
                  }`}
                />
                <span className="text-sm font-medium capitalize">{status.toLowerCase()}</span>
              </label>
            ))}
          </div>

          <DialogFooter>
            <DashboardButton
              className="w-full!"
              isLoading={isPending}
              onClick={handleSubmit}
            >
              Update Status
            </DashboardButton>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateOrderStatusModal;
