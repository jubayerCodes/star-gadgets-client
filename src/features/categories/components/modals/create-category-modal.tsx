"use client";

import DashboardButton from "@/components/dashboard/dashboard-button";
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategoryFormData, createCategoryZodSchema } from "../../schema";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { useState } from "react";
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import { useCreateCategoryMutation } from "../../hooks/useCategories";
import { useSlug } from "@/hooks/use-slug";

const CreateCategoryModal = ({ children }: { children?: React.ReactElement }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createCategory, isPending } = useCreateCategoryMutation();

  const defaultValues: CreateCategoryFormData = {
    title: "",
    slug: "",
    image: "",
    featured: false,
  };

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryZodSchema),
    defaultValues,
  });

  useSlug({ form, sourceName: "title", targetName: "slug" });

  const handleSubmit = async (data: CreateCategoryFormData) => {
    const res = await createCategory(data);

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
      <DialogTrigger render={children || <DashboardButton>Add Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Category</DialogTitle>
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

export default CreateCategoryModal;
