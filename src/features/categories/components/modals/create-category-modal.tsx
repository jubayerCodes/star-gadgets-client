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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategoryFormData, createCategoryZodSchema } from "../../schema";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { useState } from "react";
import SingleImageUploader from "@/components/SingleImageUploader";
import { IFile } from "@/types/file";
import { useCreateCategoryMutation } from "../../hooks/useCategories";

const CreateCategoryModal = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: createCategory, isPending } = useCreateCategoryMutation();

  const defaultValues: CreateCategoryFormData = {
    title: "",
    slug: "",
    featured: false,
  };

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryZodSchema),
    defaultValues,
  });

  const handleSubmit = async (data: CreateCategoryFormData) => {
    if (!file.file) {
      setFile({
        file: null,
        error: "Image is required",
      });
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("file", file.file as File);

    const res = await createCategory(formData);

    if (res.success) {
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
      <DialogTrigger render={<DashboardButton>Add Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Add Category</DialogTitle>
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

export default CreateCategoryModal;
