"use client";

import { useState } from "react";
import { useCreateSubCategoryMutation } from "../../hooks/useSubCategory";
import { CreateSubCategoryFormData, createSubCategoryZodSchema } from "../../schema";
import { useForm, Controller } from "react-hook-form";
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
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";
import InfinityComboboxField from "@/components/form/Shared/infinity-combobox-field";
import { useSlug } from "@/hooks/use-slug";

function CreateSubCategoryModal() {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createSubCategory, isPending } = useCreateSubCategoryMutation();

  const defaultValues: CreateSubCategoryFormData = {
    title: "",
    slug: "",
    image: "",
    categoryId: "",
    featured: false,
  };

  const form = useForm<CreateSubCategoryFormData>({
    resolver: zodResolver(createSubCategoryZodSchema),
    defaultValues,
  });

  useSlug({ form, sourceName: "title", targetName: "slug" });

  const handleSubmit = async (data: CreateSubCategoryFormData) => {
    const res = await createSubCategory(data);

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
                <Controller
                  control={form.control}
                  name="image"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                      <GalleryImagePicker value={field.value} onChange={field.onChange} required />
                      {fieldState.error && (
                        <p className="text-[0.8rem] font-medium text-destructive">{fieldState.error.message}</p>
                      )}
                    </div>
                  )}
                />
                <DashboardInputField
                  form={form}
                  name="title"
                  label="Title"
                  placeholder="Enter category title"
                  required
                />
                <DashboardInputField form={form} name="slug" label="Slug" placeholder="Enter category slug" required />
                <InfinityComboboxField
                  form={form}
                  name="categoryId"
                  label="Category"
                  placeholder="Select category"
                  required
                  infinityFunction={useCategoriesListInfinityQuery}
                />
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
