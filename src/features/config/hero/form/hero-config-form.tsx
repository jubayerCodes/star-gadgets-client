"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { ImageIcon, Plus } from "lucide-react";

import DashboardConfigHeader from "@/components/dashboard/dashbaord-config-header";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { useGetConfig } from "../../hooks/useConfig";
import { useUpdateHeroConfig } from "../../hooks/useHeroConfig";
import { updateHeroConfigValidation } from "../schema";
import { UpdateHeroConfigFormData, UpdateHeroConfigPayload } from "../types";
import { HeroItemCard } from "./hero-item-card";
import { HeroItemFields } from "./hero-item-form";
import { cn } from "@/lib/utils";

export function HeroConfigForm() {
  const { data: config } = useGetConfig();
  const { mutateAsync: updateHeroConfig, isPending } = useUpdateHeroConfig();

  /**
   * Index of the newly appended (draft) item, or null when not adding.
   */
  const [draftIndex, setDraftIndex] = useState<number | null>(null);

  const form = useForm<UpdateHeroConfigFormData>({
    resolver: zodResolver(updateHeroConfigValidation),
    defaultValues: {
      hero: {
        heroType: "fixed",
        fixedContent: [],
        carouselContent: [],
      },
    },
  });

  // Populate form from server data
  useEffect(() => {
    if (config?.data?.hero) {
      form.reset({
        hero: {
          heroType: config.data.hero.heroType,
          fixedContent: config.data.hero.fixedContent as UpdateHeroConfigFormData["hero"]["fixedContent"],
          carouselContent: config.data.hero.carouselContent as UpdateHeroConfigFormData["hero"]["carouselContent"],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const {
    fields: fixedFields,
    append: appendFixed,
    remove: removeFixed,
  } = useFieldArray({
    control: form.control,
    name: "hero.fixedContent",
  });

  const {
    fields: carouselFields,
    append: appendCarousel,
    remove: removeCarousel,
  } = useFieldArray({
    control: form.control,
    name: "hero.carouselContent",
  });

  const heroType = useWatch({ control: form.control, name: "hero.heroType" });
  const isFixed = heroType === "fixed";
  const fields = isFixed ? fixedFields : carouselFields;
  const append = isFixed ? appendFixed : appendCarousel;
  const remove = isFixed ? removeFixed : removeCarousel;
  const arrayName = isFixed ? "fixedContent" : "carouselContent";

  const maxItems = isFixed ? 3 : Infinity;
  // Don't count the draft item toward the "can add more" limit
  const committedCount = draftIndex !== null ? fields.length - 1 : fields.length;
  const canAddMore = committedCount < maxItems && draftIndex === null;

  // When hero type changes, clear all content and any draft
  const handleTypeChange = (type: "fixed" | "carousel") => {
    form.setValue("hero.heroType", type, { shouldDirty: true });
    setDraftIndex(null);
  };

  /** Append a blank placeholder and open HeroItemFields for it */
  const handleAddItem = () => {
    // Both types conform to the optional superset during add
    append({ id: "", image: "", link: "", button: "", buttonLink: "" });
    setDraftIndex(fields.length); // index of the just-appended item
  };

  /** User confirmed the new item — validate it, then commit */
  const handleDraftConfirm = () => {
    if (draftIndex === null) return;
    form.trigger(`hero.${arrayName}.${draftIndex}`).then((valid) => {
      if (valid) setDraftIndex(null);
    });
  };

  /** User cancelled adding — remove the draft item */
  const handleDraftCancel = () => {
    if (draftIndex !== null) {
      remove(draftIndex);
      setDraftIndex(null);
    }
  };

  const handleSubmit = (data: UpdateHeroConfigFormData) => {
    const payload: UpdateHeroConfigPayload = {
      hero: {
        heroType: data.hero.heroType,
        fixedContent: data.hero.fixedContent,
        carouselContent: data.hero.carouselContent,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    updateHeroConfig({ id: config?.data._id!, data: payload });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <DashboardConfigHeader
          title="Hero Configurations"
          description="Manage your hero section layout and content"
          isPending={isPending}
          form={form}
        />

        {/* ── Hero Type Switcher ──────────────────────────────────────────── */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-1">
            <h3 className="text-lg font-medium">Hero Type</h3>
            <p className="text-sm text-muted-foreground">
              Choose between a fixed layout (3 items) or a dynamic carousel.
            </p>
          </div>
          <div className="mt-4 flex gap-3">
            {(["fixed", "carousel"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className={cn(
                  "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all cursor-pointer",
                  heroType === type
                    ? "border-primary text-primary"
                    : "border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span className="capitalize">{type}</span>
                <p className="mt-0.5 text-xs font-normal opacity-70">
                  {type === "fixed" ? "Up to 3 items with image + link" : "Unlimited slides with button"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Hero Content ────────────────────────────────────────────────── */}
        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Hero Content</h3>
              <p className="text-sm text-muted-foreground">
                {isFixed
                  ? "Add up to 3 items. Each needs an image and a link."
                  : "Add carousel slides. Each needs an image, button label, and button link."}
              </p>
            </div>
            {canAddMore && (
              <DashboardButton
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
              >
                <Plus className="size-4" />
                Add Item
              </DashboardButton>
            )}
          </div>

          {form.formState.errors.hero?.[arrayName]?.message && (
             <p className="text-sm font-medium text-destructive">
               {form.formState.errors.hero[arrayName]?.message as string}
             </p>
          )}

          {fields.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-input py-12 text-center">
              <div className="flex size-12 items-center justify-center rounded-full border bg-muted/40">
                <ImageIcon className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">No hero items yet</p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  Click &quot;Add Item&quot; to get started
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-4 items-start",
                isFixed ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {fields.map((field, index) =>
                index === draftIndex ? (
                  /* New item: show inline fields */
                  <HeroItemFields
                    key={field.id}
                    form={form}
                    index={index}
                    heroType={heroType}
                    arrayName={arrayName}
                    mode="add"
                    onConfirm={handleDraftConfirm}
                    onCancel={handleDraftCancel}
                  />
                ) : (
                  /* Existing item: card with edit-in-place */
                  <HeroItemCard
                    key={field.id}
                    form={form}
                    index={index}
                    field={field}
                    heroType={heroType}
                    arrayName={arrayName}
                    onRemove={() => {
                      remove(index);
                      // If the draft was after this item, shift its index down
                      if (draftIndex !== null && index < draftIndex) {
                        setDraftIndex(draftIndex - 1);
                      }
                    }}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default HeroConfigForm;
