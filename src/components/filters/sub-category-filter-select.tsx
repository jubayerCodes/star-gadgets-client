"use client";

import InfinityFilterSelect from "@/components/infinity-filter-select";
import { useSubCategoriesListInfinityQuery } from "@/features/sub-categories/hooks/useSubCategory";
import { useRef } from "react";

interface SubCategoryFilterSelectProps {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  /** Optionally restrict sub-categories to a specific parent category ID */
  categoryId?: string;
  className?: string;
}

const SubCategoryFilterSelect = ({ selectedSlug, onSelect, categoryId, className }: SubCategoryFilterSelectProps) => {
  // Ref keeps the latest categoryId without making it a query-key dependency
  const categoryIdRef = useRef(categoryId);
  categoryIdRef.current = categoryId;

  // Named with "use" prefix so the linter recognises it as a hook
  const useSubCategoriesSearch = (search: string) =>
    useSubCategoriesListInfinityQuery(search, categoryIdRef.current);

  return (
    <InfinityFilterSelect
      placeholder="Sub Category"
      selectedSlug={selectedSlug}
      onSelect={onSelect}
      infinityFunction={useSubCategoriesSearch}
      className={className}
    />
  );
};

export default SubCategoryFilterSelect;
