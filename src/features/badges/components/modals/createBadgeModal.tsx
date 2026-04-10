"use client";

import { useState } from "react";
import { useCreateBadgeMutation } from "../../hooks/useBadges";
import { CreateBadgeFormData, createBadgeZodSchema } from "../../schema";
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
import CheckboxField from "@/components/form/Shared/checkbox-field";

const CreateBadgeModal = ({ children }: { children?: React.ReactElement }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createBadge, isPending } = useCreateBadgeMutation();

  const defaultValues: CreateBadgeFormData = {
    title: "",
    editable: false,
  };

  const form = useForm<CreateBadgeFormData>({
    resolver: zodResolver(createBadgeZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CreateBadgeFormData) => {
    const res = await createBadge(data);
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
      <DialogTrigger render={children || <DashboardButton>Add Badge</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Badge</DialogTitle>
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
                  Add Badge
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateBadgeModal;
