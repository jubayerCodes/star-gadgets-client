"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import DashboardSelectField from "@/components/form/dashboard/dashboard-select-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { createCouponZodSchema, CreateCouponFormData, CreateCouponFormInput } from "../../schema";
import { useCreateCouponMutation } from "../../hooks/useCoupons";

const DISCOUNT_TYPE_OPTIONS = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount (৳)" },
];

const CreateCouponModal = ({ children }: { children?: React.ReactElement }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createCoupon, isPending } = useCreateCouponMutation();

  const defaultValues: CreateCouponFormInput = {
    code: "",
    discountType: "percentage",
    discountAmount: 0,
    minOrderValue: undefined,
    expiryDate: "",
    usageLimit: 1,
    isActive: true,
    hasPerUserLimit: false,
    perUserUsageLimit: undefined,
  };

  const form = useForm<CreateCouponFormInput, unknown, CreateCouponFormData>({
    resolver: zodResolver(createCouponZodSchema),
    defaultValues,
  });

  const hasPerUserLimit = form.watch("hasPerUserLimit");

  const handleSubmit = async (data: CreateCouponFormData) => {
    const res = await createCoupon(data);
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
      <DialogTrigger render={children || <DashboardButton>Add Coupon</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Add Coupon</DialogTitle>
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
                Add Coupon
              </DashboardButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateCouponModal;
