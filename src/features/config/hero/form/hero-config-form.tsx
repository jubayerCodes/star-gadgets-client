"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import Image from "next/image";
import { X, ImageIcon, Link2, MousePointerClick } from "lucide-react";

import DashboardConfigHeader from "@/components/dashboard/dashbaord-config-header";
import { useGetConfig } from "../../hooks/useConfig";
import { useUpdateHeroConfig } from "../../hooks/useHeroConfig";
import {
  UpdateHeroConfigFormData,
  UpdateHeroConfigPayload,
  updateHeroConfigValidation,
} from "../schema";
import HeroItemModal from "../modals/hero-item-modal";
import ImagePickerModal from "../modals/image-picker-modal";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function HeroConfigForm() {
  const { data: config } = useGetConfig();
  const { mutateAsync: updateHeroConfig, isPending } = useUpdateHeroConfig();

  const form = useForm<UpdateHeroConfigFormData>({
    resolver: zodResolver(updateHeroConfigValidation),
    defaultValues: {
      hero: {
        heroType: "fixed",
        heroContent: [],
      },
    },
  });

  // Populate form from server data
  useEffect(() => {
    if (config?.data?.hero) {
      form.reset({
        hero: {
          heroType: config.data.hero.heroType,
          heroContent: config.data.hero.heroContent as UpdateHeroConfigFormData["hero"]["heroContent"],
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "hero.heroContent",
  });

  const heroType = useWatch({ control: form.control, name: "hero.heroType" });
  const isFixed = heroType === "fixed";
  const maxItems = isFixed ? 3 : Infinity;
  const canAddMore = fields.length < maxItems;

  // When hero type changes, clear content to avoid mismatched fields
  const handleTypeChange = (type: "fixed" | "carousel") => {
    form.setValue("hero.heroType", type, { shouldDirty: true });
    form.setValue("hero.heroContent", [], { shouldDirty: true });
  };

  const handleSubmit = (data: UpdateHeroConfigFormData) => {
    const payload: UpdateHeroConfigPayload = {
      hero: {
        heroType: data.hero.heroType,
        heroContent: data.hero.heroContent,
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

        {/* ── Hero Type Switcher ───────────────────────────────────────── */}
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
                  "flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                  heroType === type
                    ? "border-primary bg-primary/5 text-primary"
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

        {/* ── Hero Content ─────────────────────────────────────────────── */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Hero Content</h3>
              <p className="text-sm text-muted-foreground">
                {isFixed
                  ? `Add up to 3 items. Each needs an image and a link.`
                  : `Add carousel slides. Each needs an image, button label, and button link.`}
              </p>
            </div>
            {canAddMore && (
              <HeroItemModal
                heroType={heroType}
                mode="add"
                onSave={(item) => append(item)}
              />
            )}
          </div>

          {fields.length === 0 ? (
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
                "grid gap-4",
                isFixed ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2",
              )}
            >
              {fields.map((field, index) => (
                <HeroItemCard
                  key={field.id}
                  field={field}
                  heroType={heroType}
                  onEdit={(updated) => update(index, updated)}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Hero Item Card ───────────────────────────────────────────────────────────

interface HeroItemCardProps {
  field: UpdateHeroConfigFormData["hero"]["heroContent"][number] & { id: string };
  heroType: "fixed" | "carousel";
  onEdit: (updated: UpdateHeroConfigFormData["hero"]["heroContent"][number]) => void;
  onRemove: () => void;
}

function HeroItemCard({ field, heroType, onEdit, onRemove }: HeroItemCardProps) {
  return (
    <div className="group relative rounded-lg border bg-background shadow-sm overflow-hidden">
      {/* Image area */}
      <div className="relative h-40 w-full bg-muted/30">
        {field.image ? (
          <Image src={field.image} alt={field.id} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImagePickerModal
              value={field.image}
              onChange={(url) => onEdit({ ...field, image: url })}
              label="Add image"
            />
          </div>
        )}
        {/* Overlay actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <ImagePickerModal
            value={field.image}
            onChange={(url) => onEdit({ ...field, image: url })}
            trigger={
              <button
                type="button"
                className="flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-black hover:bg-white"
              >
                <ImageIcon className="size-3" /> Change
              </button>
            }
          />
        </div>
      </div>

      {/* Meta */}
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {field.id || "No ID"}
          </Label>
          <div className="flex items-center gap-1">
            <HeroItemModal
              heroType={heroType}
              mode="edit"
              defaultValues={field}
              onSave={onEdit}
            />
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center justify-center size-7 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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

export default HeroConfigForm;
