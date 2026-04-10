"use client";

import { useEffect } from "react";
import { useUpdateBadgeStore } from "../../store/useUpdateBadgeStore";
import { useUpdateBadgeMutation } from "../../hooks/useBadges";
import { UpdateBadgeFormData, updateBadgeZodSchema } from "../../schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import DashboardButton from "@/components/dashboard/dashboard-button";

const UpdateBadgeModal = () => {
  const { open, setOpen, badge } = useUpdateBadgeStore();

  const { mutateAsync: updateBadge, isPending } = useUpdateBadgeMutation();

  const defaultValues: UpdateBadgeFormData = {
    title: badge?.title || "",
    editable: badge?.editable ?? false,
  };

  const form = useForm<UpdateBadgeFormData>({
    resolver: zodResolver(updateBadgeZodSchema),
    defaultValues,
  });

  useEffect(() => {
    if (badge) {
      form.reset({ title: badge.title, editable: badge.editable ?? false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badge]);

  const handleSubmit = async (data: UpdateBadgeFormData) => {
    const res = await updateBadge({ id: badge?._id as string, data });
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
            <DialogTitle className={"text-xl"}>Update Badge</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FieldGroup className="gap-2">
                <DashboardInputField
                  form={form}
                  name="title"
                  label="Title"
                  placeholder="Enter badge title"
                  required
                />
                <CheckboxField form={form} name="editable" label="Editable" />
              </FieldGroup>
              <DialogFooter>
                <DashboardButton
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className={"w-full!"}
                  isLoading={isPending}
                >
                  Update Badge
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateBadgeModal;
