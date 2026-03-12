"use client";

import { useEffect } from "react";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldGroup } from "@/components/ui/field";
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { useSlug } from "@/hooks/use-slug";

const UpdateBrandModal = () => {
  const { open, setOpen, brand } = useUpdateBrandStore();

  const { mutateAsync: updateBrand, isPending } = useUpdateBrandMutation();

  const defaultValues: UpdateBrandFormData = {
    title: brand?.title || "",
    slug: brand?.slug || "",
    featured: brand?.featured || false,
    image: brand?.image || "",
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

  useSlug({ form, sourceName: "title", targetName: "slug" });

  const handleSubmit = async (data: UpdateBrandFormData) => {
    const res = await updateBrand({ id: brand?._id as string, data });

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
            <DialogTitle className={"text-xl"}>Update Brand</DialogTitle>
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
                  Update Brand
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
