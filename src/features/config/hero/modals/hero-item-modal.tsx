"use client";

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
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImagePickerModal from "./image-picker-modal";
import { HeroItemFormData } from "../schema";
import { Plus, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── per-type schemas ────────────────────────────────────────────────────────
const fixedSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().min(1, "Link is required"),
  button: z.string().optional(),
  buttonLink: z.string().optional(),
});

const carouselSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().optional(),
  button: z.string().min(1, "Button label is required"),
  buttonLink: z.string().min(1, "Button link is required"),
});

type HeroItemSchema = z.infer<typeof fixedSchema>;

interface HeroItemModalProps {
  heroType: "fixed" | "carousel";
  onSave: (item: HeroItemFormData) => void;
  defaultValues?: HeroItemFormData;
  mode?: "add" | "edit";
}

function HeroItemModal({ heroType, onSave, defaultValues, mode = "add" }: HeroItemModalProps) {
  const [open, setOpen] = useState(false);

  const schema = heroType === "fixed" ? fixedSchema : carouselSchema;

  const form = useForm<HeroItemSchema>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? {
      id: "",
      image: "",
      link: "",
      button: "",
      buttonLink: "",
    },
  });

  const handleOpen = (val: boolean) => {
    if (val && defaultValues) {
      form.reset(defaultValues);
    } else if (!val) {
      form.reset();
    }
    setOpen(val);
  };

  const handleSave = (data: HeroItemSchema) => {
    onSave(data as HeroItemFormData);
    setOpen(false);
    form.reset();
  };

  const fieldClass = "flex flex-col gap-1.5";
  const inputClass = "h-9 text-sm";
  const errorClass = "text-xs text-destructive";

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger
        render={
          mode === "add" ? (
            <DashboardButton variant="outline" size="sm" type="button">
              <Plus className="h-4 w-4" />
              Add Item
            </DashboardButton>
          ) : (
            <button
              type="button"
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Edit item"
            >
              <Pencil className="size-3.5" />
            </button>
          )
        }
      />
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {mode === "add" ? "Add" : "Edit"} Hero Item
              <span className="ml-2 text-sm font-normal text-muted-foreground capitalize">({heroType})</span>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            {/* Image */}
            <div className={fieldClass}>
              <Label className="text-sm font-medium">Image *</Label>
              <Controller
                control={form.control}
                name="image"
                render={({ field, fieldState }) => (
                  <>
                    <ImagePickerModal
                      value={field.value}
                      onChange={field.onChange}
                      label="Select hero image"
                    />
                    {fieldState.error && (
                      <p className={errorClass}>{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>

            {/* ID */}
            <div className={fieldClass}>
              <Label htmlFor="hero-item-id" className="text-sm font-medium">
                ID <span className="text-muted-foreground text-xs">(unique identifier)</span>
              </Label>
              <Input
                id="hero-item-id"
                className={cn(inputClass, form.formState.errors.id && "border-destructive")}
                placeholder="e.g. hero-1"
                {...form.register("id")}
              />
              {form.formState.errors.id && (
                <p className={errorClass}>{form.formState.errors.id.message}</p>
              )}
            </div>

            {/* Fixed type: Link */}
            {heroType === "fixed" && (
              <div className={fieldClass}>
                <Label htmlFor="hero-item-link" className="text-sm font-medium">Link *</Label>
                <Input
                  id="hero-item-link"
                  className={cn(inputClass, form.formState.errors.link && "border-destructive")}
                  placeholder="e.g. /category/phones"
                  {...form.register("link")}
                />
                {form.formState.errors.link && (
                  <p className={errorClass}>{form.formState.errors.link.message}</p>
                )}
              </div>
            )}

            {/* Carousel type: Button + ButtonLink */}
            {heroType === "carousel" && (
              <>
                <div className={fieldClass}>
                  <Label htmlFor="hero-item-button" className="text-sm font-medium">Button Label *</Label>
                  <Input
                    id="hero-item-button"
                    className={cn(inputClass, form.formState.errors.button && "border-destructive")}
                    placeholder="e.g. Shop Now"
                    {...form.register("button")}
                  />
                  {form.formState.errors.button && (
                    <p className={errorClass}>{form.formState.errors.button.message}</p>
                  )}
                </div>
                <div className={fieldClass}>
                  <Label htmlFor="hero-item-buttonLink" className="text-sm font-medium">Button Link *</Label>
                  <Input
                    id="hero-item-buttonLink"
                    className={cn(inputClass, form.formState.errors.buttonLink && "border-destructive")}
                    placeholder="e.g. /products?sale=true"
                    {...form.register("buttonLink")}
                  />
                  {form.formState.errors.buttonLink && (
                    <p className={errorClass}>{form.formState.errors.buttonLink.message}</p>
                  )}
                </div>
              </>
            )}

            <DialogFooter>
              <DashboardButton type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </DashboardButton>
              <DashboardButton type="submit">
                {mode === "add" ? "Add Item" : "Save Changes"}
              </DashboardButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default HeroItemModal;
