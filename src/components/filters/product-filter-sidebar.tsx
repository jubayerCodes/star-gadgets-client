"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";

// ─── Filter section config types ─────────────────────────────────────────────

export interface RadioFilterConfig {
  type: "radio";
  /** Section heading displayed in the sidebar */
  label: string;
  /** Unique name attribute for the radio group (avoids cross-page conflicts) */
  radioGroupName: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}

export interface CheckboxFilterConfig {
  type: "checkbox";
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  singleSelect?: boolean;
  /** Limit the list height and add a scrollbar when there are many options */
  scrollable?: boolean;
}

export interface PriceRangeFilterConfig {
  type: "priceRange";
  label?: string;
  min: string;
  max: string;
  onApply: (min: string, max: string) => void;
}

export type FilterSectionConfig =
  | RadioFilterConfig
  | CheckboxFilterConfig
  | PriceRangeFilterConfig;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProductFilterSidebarProps {
  /** Ordered list of filter sections to render */
  sections: FilterSectionConfig[];
  /** Whether any filter is currently active (drives "Clear all" visibility) */
  hasActiveFilters: boolean;
  onClearAll: () => void;
  // ── Mobile drawer control (managed by the parent page) ──
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// ─── Individual section renderers ─────────────────────────────────────────────

function RadioSection({ section }: { section: RadioFilterConfig }) {
  return (
    <div className="border border-border p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{section.label}</p>
      <div className="flex flex-col gap-2">
        {section.options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name={section.radioGroupName}
              value={opt.value}
              checked={section.value === opt.value}
              onChange={() => section.onChange(opt.value)}
              className="accent-foreground"
            />
            <span className="text-sm text-foreground group-hover:text-tartiary transition-colors">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxSection({ section }: { section: CheckboxFilterConfig }) {
  if (section.options.length === 0) return null;

  const handleToggle = (val: string) => {
    if (section.singleSelect) {
      const next = section.selected.includes(val) ? [] : [val];
      section.onChange(next);
    } else {
      const next = section.selected.includes(val)
        ? section.selected.filter((v) => v !== val)
        : [...section.selected, val];
      section.onChange(next);
    }
  };

  return (
    <div className="border border-border p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{section.label}</p>
      <div
        className={
          section.scrollable
            ? "flex flex-col gap-2 max-h-52 overflow-y-auto pr-1"
            : "flex flex-col gap-2"
        }
      >
        {section.options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={section.selected.includes(opt.value)}
              onChange={() => handleToggle(opt.value)}
              className="accent-foreground"
            />
            <span className="text-sm text-foreground group-hover:text-tartiary transition-colors truncate">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function PriceRangeSection({ section }: { section: PriceRangeFilterConfig }) {
  const [localMin, setLocalMin] = useState(section.min);
  const [localMax, setLocalMax] = useState(section.max);

  useEffect(() => { setLocalMin(section.min); }, [section.min]);
  useEffect(() => { setLocalMax(section.max); }, [section.max]);

  return (
    <div className="border border-border p-4 flex flex-col gap-3">
      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
        {section.label ?? "Price Range"}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-full h-9 px-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <span className="text-muted-foreground text-sm shrink-0">–</span>
        <input
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-full h-9 px-2 text-sm border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => section.onApply(localMin, localMax)}
      >
        Apply
      </Button>
    </div>
  );
}

function SectionRenderer({ section }: { section: FilterSectionConfig }) {
  if (section.type === "radio") return <RadioSection section={section} />;
  if (section.type === "checkbox") return <CheckboxSection section={section} />;
  if (section.type === "priceRange") return <PriceRangeSection section={section} />;
  return null;
}

// ─── Inner sidebar content (shared between desktop aside & mobile drawer) ─────

function SidebarContent({
  sections,
  hasActiveFilters,
  onClearAll,
}: {
  sections: FilterSectionConfig[];
  hasActiveFilters: boolean;
  onClearAll: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <SlidersHorizontal className="size-4" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-xs text-tartiary hover:underline underline-offset-4 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sections */}
      {sections.map((section, i) => (
        <SectionRenderer key={i} section={section} />
      ))}
    </div>
  );
}

// ─── Mobile filter toggle button (exported for parent pages) ──────────────────

export function FilterToggleButton({
  onClick,
  hasActiveFilters,
}: {
  onClick: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="flex lg:hidden w-full">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-foreground text-background font-bold">
            !
          </span>
        )}
      </button>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export default function ProductFilterSidebar({
  sections,
  hasActiveFilters,
  onClearAll,
  mobileOpen,
  onMobileClose,
}: ProductFilterSidebarProps) {

  return (
    <>
      {/* ── Mobile drawer (shadcn/vaul, direction=left) ────────────────── */}
      <Drawer open={mobileOpen} onOpenChange={(open) => { if (!open) onMobileClose(); }} direction="left">
        <DrawerContent
          className="lg:hidden w-80 max-w-[85vw] h-full flex flex-col overflow-y-auto"
        >
          <DrawerHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
            <DrawerTitle className="text-base">Filters</DrawerTitle>
            <DrawerClose asChild>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <SidebarContent
              sections={sections}
              hasActiveFilters={hasActiveFilters}
              onClearAll={onClearAll}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Desktop aside ─────────────────────────────────────────────── */}
      <aside className="hidden lg:block w-64 shrink-0">
        <SidebarContent
          sections={sections}
          hasActiveFilters={hasActiveFilters}
          onClearAll={onClearAll}
        />
      </aside>
    </>
  );
}
