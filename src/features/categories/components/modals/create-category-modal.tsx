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
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCategoryFormData, createCategoryZodSchema } from "../../schema";
import { FieldGroup } from "@/components/ui/field";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";
import CheckboxField from "@/components/form/Shared/checkbox-field";

const CreateCategoryModal = () => {
  const defaultValues: CreateCategoryFormData = {
    title: "",
    slug: "",
    featured: false,
  };

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategoryZodSchema),
    defaultValues,
  });

  const handleSubmit = (data: CreateCategoryFormData) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger render={<DashboardButton>Add Category</DashboardButton>} />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-lg!">
          <DialogHeader>
            <DialogTitle className={"text-2xl"}>Add Category</DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FieldGroup className="gap-2">
                <DashboardInputField form={form} name="title" label="Title" placeholder="Enter category title" required />
                <DashboardInputField form={form} name="slug" label="Slug" placeholder="Enter category slug" required />
                <CheckboxField form={form} name="featured" label="Featured" />
              </FieldGroup>
            </form>
          </div>
          <DialogFooter>
            <DialogClose className={"w-full!"} render={<DashboardButton>Add Category</DashboardButton>} />
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateCategoryModal;
