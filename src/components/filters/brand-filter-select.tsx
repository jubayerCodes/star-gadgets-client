"use client";

import InfinityFilterSelect from "@/components/infinity-filter-select";
import { useBrandsListInfinityQuery } from "@/features/brands/hooks/useBrands";

interface BrandFilterSelectProps {
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  className?: string;
}

const BrandFilterSelect = ({ selectedSlug, onSelect, className }: BrandFilterSelectProps) => {
  return (
    <InfinityFilterSelect
      placeholder="Brand"
      selectedSlug={selectedSlug}
      onSelect={onSelect}
      infinityFunction={useBrandsListInfinityQuery}
      className={className}
    />
  );
};

export default BrandFilterSelect;
