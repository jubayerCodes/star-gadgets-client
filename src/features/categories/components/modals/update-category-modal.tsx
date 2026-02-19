"use client";

import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateCategoryFormData, updateCategoryZodSchema } from "../../schema";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { useEffect, useState } from "react";
import SingleImageUploader from "@/components/SingleImageUploader";
import { IFile } from "@/types/file";
import { useUpdateCategoryMutation } from "../../hooks/useCategories";
import { createFormDataAction } from "@/hooks/createFormDataAction";
import { ICategory } from "../../types";
import { useUpdateCategoryStore } from "../../store/updateCategoryStore";
import DashboardButton from "@/components/dashboard/dashboard-button";

const UpdateCategoryModal = () => {
  const { open, setOpen, category } = useUpdateCategoryStore();

  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: updateCategory, isPending } = useUpdateCategoryMutation();

  const defaultValues: UpdateCategoryFormData = {
    title: category?.title || "",
    slug: category?.slug || "",
    featured: category?.featured || false,
  };

  useEffect(() => {
    if (category) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategoryZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: UpdateCategoryFormData) => {
    const res = await createFormDataAction<UpdateCategoryFormData, ICategory>({
      data,
      file,
      setFile,
      action: updateCategory,
      id: category?._id,
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
          preview: category?.image,
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

export default UpdateCategoryModal;
