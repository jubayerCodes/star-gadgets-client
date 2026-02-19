"use client";

import { IFile } from "@/types/file";
import { useState } from "react";
import { useCreateSubCategoryMutation } from "../../hooks/useSubCategory";
import { CreateSubCategoryFormData, createSubCategoryZodSchema } from "../../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormDataAction } from "@/hooks/createFormDataAction";
import { ISubCategory } from "../../types";
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
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";

function CreateSubCategoryModal() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const {
    data,
    hasNextPage,
    hasPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useCategoriesListInfinityQuery();

  console.log(data);

  const { mutateAsync: createSubCategory, isPending } = useCreateSubCategoryMutation();

  const defaultValues: CreateSubCategoryFormData = {
    title: "",
    slug: "",
    categoryId: "",
    featured: false,
  };

  const form = useForm<CreateSubCategoryFormData>({
    resolver: zodResolver(createSubCategoryZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CreateSubCategoryFormData) => {
    const res = await createFormDataAction<CreateSubCategoryFormData, ISubCategory>({
      data,
      file,
      setFile,
      action: createSubCategory,
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
      <DialogTrigger render={<DashboardButton>Add Sub Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Sub Category</DialogTitle>
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
                  Add Sub Category
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default CreateSubCategoryModal;
