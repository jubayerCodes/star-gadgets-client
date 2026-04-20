"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import DashboardSelectField from "@/components/form/dashboard/dashboard-select-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { updateCouponZodSchema, UpdateCouponFormData, UpdateCouponFormInput } from "../../schema";
import { useUpdateCouponMutation } from "../../hooks/useCoupons";
import { useUpdateCouponStore } from "../../store/updateCouponStore";

const DISCOUNT_TYPE_OPTIONS = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount (৳)" },
];

const UpdateCouponModal = () => {
  const { open, setOpen, coupon } = useUpdateCouponStore();
  const { mutateAsync: updateCoupon, isPending } = useUpdateCouponMutation();

  const buildDefaultValues = (): UpdateCouponFormInput => ({
    code: coupon?.code ?? "",
    discountType: coupon?.discountType ?? "percentage",
    discountAmount: coupon?.discountAmount ?? 0,
    minOrderValue: coupon?.minOrderValue ?? undefined,
    expiryDate: coupon?.expiryDate ? coupon.expiryDate.split("T")[0] : "",
    usageLimit: coupon?.usageLimit ?? 1,
    isActive: coupon?.isActive ?? true,
    hasPerUserLimit: coupon?.hasPerUserLimit ?? false,
    perUserUsageLimit: coupon?.perUserUsageLimit || undefined,
  });

  const form = useForm<UpdateCouponFormInput, unknown, UpdateCouponFormData>({
    resolver: zodResolver(updateCouponZodSchema),
    defaultValues: buildDefaultValues(),
  });

  const hasPerUserLimit = form.watch("hasPerUserLimit");

  useEffect(() => {
    if (coupon) {
      form.reset(buildDefaultValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coupon]);

  const handleSubmit = async (data: UpdateCouponFormData) => {
    const res = await updateCoupon({ id: coupon?._id as string, data });
    if (res && res.success) {
      setOpen(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={() => {
        form.reset();
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Coupon</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FieldGroup className="gap-3">
              {/* Code */}
              <DashboardInputField form={form} name="code" label="Coupon Code" placeholder="e.g. SUMMER20" required />

              {/* Discount type */}
              <DashboardSelectField
                form={form}
                name="discountType"
                label="Discount Type"
                options={DISCOUNT_TYPE_OPTIONS}
                required
              />

              {/* Discount amount + min order */}
              <div className="grid grid-cols-2 gap-3">
                <DashboardInputField
                  form={form}
                  name="discountAmount"
                  label="Discount Amount"
                  placeholder="e.g. 20"
                  type="number"
                  required
                />
                <DashboardInputField
                  form={form}
                  name="minOrderValue"
                  label="Min Order Value"
                  placeholder="Optional"
                  type="number"
                />
              </div>

              {/* Expiry + usage limit */}
              <div className="grid grid-cols-2 gap-3">
                <DashboardInputField form={form} name="expiryDate" label="Expiry Date" type="date" required />
                <DashboardInputField
                  form={form}
                  name="usageLimit"
                  label="Total Usage Limit"
                  placeholder="e.g. 100"
                  type="number"
                  required
                />
              </div>

              {/* Per-user limit toggle */}
              <CheckboxField form={form} name="hasPerUserLimit" label="Enable per-user usage limit" />

              {/* Per-user limit count — shown only when toggle is on */}
              {hasPerUserLimit && (
                <DashboardInputField
                  form={form}
                  name="perUserUsageLimit"
                  label="Max Uses Per User"
                  placeholder="e.g. 1"
                  type="number"
                  required
                />
              )}

              {/* Active toggle */}
              <CheckboxField form={form} name="isActive" label="Active" />
            </FieldGroup>

            <DialogFooter>
              <DashboardButton
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
                className="w-full!"
                isLoading={isPending}
              >
                Update Coupon
              </DashboardButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateCouponModal;
