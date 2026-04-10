"use client";

import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { useAllBadgesQuery } from "@/features/badges/hooks/useBadges";
import { IBadge } from "@/features/badges/types";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ProductBadgesFieldProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

interface BadgeEntry {
  title: string;
  value?: string;
}

const ProductBadgesField = ({ control, register }: ProductBadgesFieldProps) => {
  const { data: badgesData, isLoading } = useAllBadgesQuery();
  const allBadges: IBadge[] = badgesData?.data ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { fields, append, remove, update } = useFieldArray<any>({
    control,
    name: "badges",
  });

  const badgeFields = fields as (BadgeEntry & { id: string })[];

  // Titles already added — prevent duplicates
  const usedTitles = new Set(badgeFields.map((f) => f.title).filter(Boolean));

  // Badges not yet added
  const availableBadges = allBadges.filter((b) => !usedTitles.has(b.title));

  const handleAddBadge = () => {
    const next = availableBadges[0];
    if (!next) return;
    append({ title: next.title, value: next.editable ? "" : undefined });
  };

  const handleSelectBadge = (index: number, title: string) => {
    const badge = allBadges.find((b) => b.title === title);
    if (!badge) return;
    update(index, { title: badge.title, value: badge.editable ? "" : undefined });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading badges…</p>;
  }

  if (allBadges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No badges created yet.{" "}
        <a href="/dashboard/products/badges" className="underline text-primary" target="_blank" rel="noreferrer">
          Manage Badges →
        </a>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {badgeFields.map((field, index) => {
        const selectedBadge = allBadges.find((b) => b.title === field.title);
        const isEditable = selectedBadge?.editable ?? false;

        // Available for this row = unused + currently selected
        const rowAvailable = allBadges.filter(
          (b) => !usedTitles.has(b.title) || b.title === field.title,
        );

        return (
          <div key={field.id} className="flex items-center gap-2">
            {/* Badge selector */}
            <Select value={field.title} onValueChange={(val) => handleSelectBadge(index, val)}>
              <SelectTrigger className="flex-1 h-9 text-sm border border-input shadow-sm transition-colors data-[state=open]:border-ring focus-visible:ring-0">
                <SelectValue placeholder="Select badge…" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {rowAvailable.map((b) => (
                    <SelectItem key={b._id} value={b.title}>
                      {b.title}
                      {b.editable && (
                        <span className="ml-1.5 text-xs text-muted-foreground">(requires value)</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Value input — only shown when editable */}
            {isEditable && (
              <Input
                className="flex-1 h-9 text-sm"
                placeholder="Enter value…"
                {...register(`badges.${index}.value`)}
              />
            )}

            {/* Remove */}
            <DashboardButton
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </DashboardButton>
          </div>
        );
      })}

      <DashboardButton
        type="button"
        variant="outline"
        size="sm"
        className="self-start text-xs"
        disabled={availableBadges.length === 0}
        onClick={handleAddBadge}
      >
        <Plus className="mr-1 h-3 w-3" />
        Add Badge
      </DashboardButton>

      {availableBadges.length === 0 && badgeFields.length > 0 && (
        <p className="text-xs text-muted-foreground">All available badges have been added.</p>
      )}
    </div>
  );
};

export default ProductBadgesField;
