import { IFile } from "@/types/file";
import { useEffect, useState } from "react";
import { useUpdateSubCategoryMutation } from "../../hooks/useSubCategory";
import { UpdateSubCategoryFormData, updateSubCategoryZodSchema } from "../../schema";
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
import InfinityComboboxField from "@/components/form/Shared/infinity-combobox-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";
import { useUpdateSubCategoryStore } from "../../store/useUpdateSubCategoryStore";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";

const UpdateSubCategoryModal = () => {
  const { open, setOpen, subCategory } = useUpdateSubCategoryStore();

  const [file, setFile] = useState<IFile>({
    file: null,
    error: null,
  });

  const { mutateAsync: updateSubCategory, isPending } = useUpdateSubCategoryMutation();

  const defaultValues: UpdateSubCategoryFormData = {
    title: subCategory?.title,
    slug: subCategory?.slug,
    categoryId: subCategory?.categoryId._id as string,
    featured: false,
  };

  const form = useForm<UpdateSubCategoryFormData>({
    resolver: zodResolver(updateSubCategoryZodSchema),
    defaultValues,
  });

  useEffect(() => {
    if (subCategory) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategory]);

  const handleSubmit = async (data: UpdateSubCategoryFormData) => {
    const res = await createFormDataAction<UpdateSubCategoryFormData, ISubCategory>({
      data,
      file,
      setFile,
      action: updateSubCategory,
      id: subCategory?._id,
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
          preview: subCategory?.image,
        });
      }}
    >
      <DialogTrigger render={<DashboardButton>Update Sub Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-xl"}>Update Sub Category</DialogTitle>
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
                  Update Sub Category
                </DashboardButton>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateSubCategoryModal;
