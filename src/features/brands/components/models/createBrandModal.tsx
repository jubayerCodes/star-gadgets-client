"use client";
import { IFile } from "@/types/file";
import { useState } from "react";
import { useCreateBrandMutation } from "../../hooks/useBrands";
import { CreateBrandFormData, createBrandZodSchema } from "../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IBrand } from "../../types";
import { createFormDataAction } from "@/hooks/createFormDataAction";
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
import SingleImageUploader from "@/components/SingleImageUploader";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";

const CreateBrandModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: createBrand, isPending } = useCreateBrandMutation();

  const defaultValues: CreateBrandFormData = {
    title: "",
    slug: "",
    featured: false,
  };

  const form = useForm<CreateBrandFormData>({
    resolver: zodResolver(createBrandZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CreateBrandFormData) => {
    const res = await createFormDataAction<CreateBrandFormData, IBrand>({
      data,
      file,
      setFile,
      action: createBrand,
    });

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
        setFile({
          file: null,
          error: null,
        });
      }}
    >
      <DialogTrigger render={<DashboardButton>Add Brand</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Brand</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FieldGroup className="gap-2">
                <SingleImageUploader file={file} onChange={setFile} required />
                <DashboardInputField form={form} name="title" label="Title" placeholder="Enter brand title" required />
                <DashboardInputField form={form} name="slug" label="Slug" placeholder="Enter brand slug" required />
                <CheckboxField form={form} name="featured" label="Featured" />
              </FieldGroup>
              <DialogFooter>
                <DashboardButton
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className={"w-full!"}
                  isLoading={isPending}
                >
                  Add Brand
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateBrandModal;
