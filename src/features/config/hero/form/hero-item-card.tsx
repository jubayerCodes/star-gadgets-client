"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Link2, MousePointerClick, Pencil } from "lucide-react";
import { UseFormReturn, useWatch } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { UpdateHeroConfigFormData, HeroItemFormData } from "../types";
import { HeroItemFields } from "./hero-item-form";

// ─── Props ────────────────────────────────────────────────────────────────────
interface HeroItemCardProps {
  form: UseFormReturn<UpdateHeroConfigFormData>;
  index: number;
  arrayName: "fixedContent" | "carouselContent";
  /** Snapshot of field values for display and cancel-revert */
  field: HeroItemFormData & { id: string };
  heroType: "fixed" | "carousel";
  onRemove: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function HeroItemCard({ form, index, arrayName, field: initialField, heroType, onRemove }: HeroItemCardProps) {
  const liveField = useWatch({
    control: form.control,
    name: `hero.${arrayName}.${index}` as const,
  });
  
  const field = (liveField || initialField) as HeroItemFormData & { id: string };

  const [editing, setEditing] = useState(false);
  // Snapshot values so we can revert on cancel
  const [snapshot, setSnapshot] = useState<HeroItemFormData | null>(null);

  const handleEditStart = () => {
    // Capture current form values as a snapshot before editing
    const current = form.getValues(`hero.${arrayName}.${index}`);
    setSnapshot(current as HeroItemFormData);
    setEditing(true);
  };

  const handleConfirm = () => {
    // Trigger validation for this item only
    form.trigger(`hero.${arrayName}.${index}`).then((valid) => {
      if (valid) setEditing(false);
    });
  };

  const handleCancel = () => {
    // Revert the form fields back to the snapshot
    if (snapshot) {
      // Need cast to any because TS struggles with dynamically keyed arrays inside nested structures
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setValue(`hero.${arrayName}.${index}` as any, snapshot);
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <HeroItemFields
        form={form}
        index={index}
        heroType={heroType}
        arrayName={arrayName}
        mode="edit"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="group relative rounded-lg border bg-background shadow-sm overflow-hidden">
      {/* Image area */}
      <div className="relative h-40 w-full bg-muted/30">
        {field.image ? (
          <Image src={field.image} alt={field.id || "Hero item"} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            No image
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
            {field.id || "No ID"}
          </Label>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleEditStart}
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground cursor-pointer hover:text-white hover:bg-accent transition-colors"
              aria-label="Edit item"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              aria-label="Remove item"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {heroType === "fixed" && field.link && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            <Link2 className="size-3 shrink-0" />
            <span className="truncate">{field.link}</span>
          </div>
        )}

        {heroType === "carousel" && (
          <>
            {field.button && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MousePointerClick className="size-3 shrink-0" />
                <span className="font-medium">{field.button}</span>
              </div>
            )}
            {field.buttonLink && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                <Link2 className="size-3 shrink-0" />
                <span className="truncate">{field.buttonLink}</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
