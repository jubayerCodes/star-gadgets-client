"use client";
import { useState } from "react";
import { useCreateBrandMutation } from "../../hooks/useBrands";
import { CreateBrandFormData, createBrandZodSchema } from "../../schema";
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
import { useSlug } from "@/hooks/use-slug";

const CreateBrandModal = ({ children }: { children?: React.ReactElement }) => {
  const [open, setOpen] = useState(false);

  const { mutateAsync: createBrand, isPending } = useCreateBrandMutation();

  const defaultValues: CreateBrandFormData = {
    title: "",
    slug: "",
    image: "",
    featured: false,
  };

  const form = useForm<CreateBrandFormData>({
    resolver: zodResolver(createBrandZodSchema),
    defaultValues,
  });

  useSlug({ form, sourceName: "title", targetName: "slug" });

  const handleSubmit = async (data: CreateBrandFormData) => {
    const res = await createBrand(data);

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
      <DialogTrigger render={children || <DashboardButton>Add Brand</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Add Brand</DialogTitle>
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
