"use client";

import InfinityFilterSelect from "@/components/infinity-filter-select";
import { useCategoriesListInfinityQuery } from "@/features/categories/hooks/useCategories";

interface CategoryFilterSelectProps {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  className?: string;
}

const CategoryFilterSelect = ({ selectedSlug, onSelect, className }: CategoryFilterSelectProps) => {
  return (
    <InfinityFilterSelect
      placeholder="Category"
      selectedSlug={selectedSlug}
      onSelect={onSelect}
      infinityFunction={useCategoriesListInfinityQuery}
      className={className}
    />
  );
};

export default CategoryFilterSelect;
