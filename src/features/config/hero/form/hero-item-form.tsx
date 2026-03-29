"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { X, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryImagePicker } from "@/components/shared/GalleryImagePicker";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { UpdateHeroConfigFormData } from "../types";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeroItemFieldsProps {
  form: UseFormReturn<UpdateHeroConfigFormData>;
  index: number;
  heroType: "fixed" | "carousel";
  arrayName: "fixedContent" | "carouselContent";
  /** Label shown in the header: "New" for a fresh append, "Edit" for an existing one */
  mode?: "add" | "edit";
  onConfirm: () => void;
  onCancel: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroItemFields({
  form,
  index,
  heroType,
  arrayName,
  mode = "add",
  onConfirm,
  onCancel,
}: HeroItemFieldsProps) {
  const { register, control, formState: { errors } } = form;

  // Safely navigate to nested errors
  const itemErrors = errors.hero?.[arrayName]?.[index];

  const fieldClass = "flex flex-col gap-1.5";
  const inputClass = "h-9 text-sm";
  const errorClass = "text-xs text-destructive";

  return (
    <div className="rounded-lg border border-primary/30 bg-accent/5 p-4 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold capitalize">
          {mode === "add" ? "New" : "Edit"} Item{" "}
          <span className="text-muted-foreground font-normal">({heroType})</span>
        </h4>
        <button
          type="button"
          aria-label="Cancel"
          onClick={onCancel}
          className="flex items-center justify-center size-6 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Image */}
        <div className={fieldClass}>
          <Label className="text-sm font-medium">Image *</Label>
          <Controller
            control={control}
            name={`hero.${arrayName}.${index}.image` as const}
            render={({ field, fieldState }) => (
              <>
                <GalleryImagePicker
                  value={field.value}
                  onChange={field.onChange}
                  className="min-h-44"
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
          <Label htmlFor={`hero-item-id-${index}`} className="text-sm font-medium">
            ID <span className="text-muted-foreground text-xs">(unique identifier)</span>
          </Label>
          <Input
            id={`hero-item-id-${index}`}
            className={cn(inputClass, itemErrors?.id && "border-destructive")}
            placeholder="e.g. hero-1"
            {...register(`hero.${arrayName}.${index}.id` as const)}
          />
          {itemErrors?.id && <p className={errorClass}>{itemErrors.id.message}</p>}
        </div>

        {/* Fixed: Link */}
        {heroType === "fixed" && (
          <div className={fieldClass}>
            <Label htmlFor={`hero-item-link-${index}`} className="text-sm font-medium">
              Link *
            </Label>
            <Input
              id={`hero-item-link-${index}`}
              className={cn(inputClass, itemErrors?.[`link`] && "border-destructive")}
              placeholder="e.g. /category/phones"
              {...register(`hero.${arrayName}.${index}.link` as const)}
            />
            {itemErrors && 'link' in itemErrors && itemErrors.link && (
              <p className={errorClass}>{itemErrors.link.message}</p>
            )}
          </div>
        )}

        {/* Carousel: Button + ButtonLink */}
        {heroType === "carousel" && (
          <>
            <div className={fieldClass}>
              <Label htmlFor={`hero-item-button-${index}`} className="text-sm font-medium">
                Button Label *
              </Label>
              <Input
                id={`hero-item-button-${index}`}
                className={cn(inputClass, itemErrors?.[`button`] && "border-destructive")}
                placeholder="e.g. Shop Now"
                {...register(`hero.${arrayName}.${index}.button` as const)}
              />
              {itemErrors && 'button' in itemErrors && itemErrors.button && (
                <p className={errorClass}>{itemErrors.button.message}</p>
              )}
            </div>
            <div className={fieldClass}>
              <Label htmlFor={`hero-item-buttonLink-${index}`} className="text-sm font-medium">
                Button Link *
              </Label>
              <Input
                id={`hero-item-buttonLink-${index}`}
                className={cn(inputClass, itemErrors?.[`buttonLink`] && "border-destructive")}
                placeholder="e.g. /products?sale=true"
                {...register(`hero.${arrayName}.${index}.buttonLink` as const)}
              />
              {itemErrors && 'buttonLink' in itemErrors && itemErrors.buttonLink && (
                <p className={errorClass}>{itemErrors.buttonLink.message}</p>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <DashboardButton type="button" variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </DashboardButton>
          <DashboardButton type="button" size="sm" onClick={onConfirm}>
            <Check className="size-3.5" />
            {mode === "add" ? "Add Item" : "Save Changes"}
          </DashboardButton>
        </div>
      </div>
    </div>
  );
}
