"use client";

import { IFile } from "@/types/file";
import { useEffect, useState } from "react";
import { useUpdateBrandStore } from "../../store/useUpdateBrandStore";
import { useUpdateBrandMutation } from "../../hooks/useBrands";
import { UpdateBrandFormData, updateBrandZodSchema } from "../../schema";
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
import { createFormDataAction } from "@/hooks/createFormDataAction";
import { IBrand } from "../../types";
import { FieldGroup } from "@/components/ui/field";
import SingleImageUploader from "@/components/SingleImageUploader";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import DashboardButton from "@/components/dashboard/dashboard-button";

const UpdateBrandModal = () => {
  const { open, setOpen, brand } = useUpdateBrandStore();

  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: updateBrand, isPending } = useUpdateBrandMutation();

  const defaultValues: UpdateBrandFormData = {
    title: brand?.title || "",
    slug: brand?.slug || "",
    featured: brand?.featured || false,
  };

  useEffect(() => {
    if (brand) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand]);

  const form = useForm<UpdateBrandFormData>({
    resolver: zodResolver(updateBrandZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: UpdateBrandFormData) => {
    const res = await createFormDataAction<UpdateBrandFormData, IBrand>({
      data,
      file,
      setFile,
      action: updateBrand,
      id: brand?._id,
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
          preview: brand?.image,
        });
      }}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Category</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FieldGroup className="gap-2">
                <SingleImageUploader file={file} onChange={setFile} required />
                <DashboardInputField
                  form={form}
                  name="title"
                  label="Title"
                  placeholder="Enter category title"
                  required
                />
                <DashboardInputField form={form} name="slug" label="Slug" placeholder="Enter category slug" required />
                <CheckboxField form={form} name="featured" label="Featured" />
              </FieldGroup>
              <DialogFooter>
                <DashboardButton
                  type="submit"
                  onClick={form.handleSubmit(handleSubmit)}
                  className={"w-full!"}
                  isLoading={isPending}
                >
                  Add Category
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateBrandModal;
