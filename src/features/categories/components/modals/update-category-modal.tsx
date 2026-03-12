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
import { useEffect } from "react";
import { useUpdateCategoryMutation } from "../../hooks/useCategories";
import { useUpdateCategoryStore } from "../../store/updateCategoryStore";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Controller } from "react-hook-form";
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import { useSlug } from "@/hooks/use-slug";

const UpdateCategoryModal = () => {
  const { open, setOpen, category } = useUpdateCategoryStore();

  const { mutateAsync: updateCategory, isPending } = useUpdateCategoryMutation();

  const defaultValues: UpdateCategoryFormData = {
    title: category?.title || "",
    slug: category?.slug || "",
    featured: category?.featured || false,
    image: category?.image || "",
  };

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategoryZodSchema),
    defaultValues,
  });

  useSlug({ form, sourceName: "title", targetName: "slug" });

  useEffect(() => {
    if (category) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSubmit = async (data: UpdateCategoryFormData) => {
    const res = await updateCategory({ id: category?._id as string, data });

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
            <DialogTitle className={"text-xl"}>Update Category</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FieldGroup className="gap-2">
                <Controller
                  control={form.control}
                  name="image"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-1">
                      <GalleryImagePicker value={field.value} onChange={field.onChange} />
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
