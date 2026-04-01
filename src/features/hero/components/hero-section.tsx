"use client";

import { useConfigStore } from "@/store/configStore";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const HeroFixed = dynamic(() => import("./hero-fixed"), { ssr: false });
const HeroCarousel = dynamic(() => import("./hero-carousel"), { ssr: false });

const HeroSkeleton = () => (
  <div className="hero-fixed-grid">
    <Skeleton className="hero-skeleton-main" />
    <div className="hero-fixed-stack">
      <Skeleton className="hero-skeleton-small" />
      <Skeleton className="hero-skeleton-small" />
    </div>
  </div>
);

const HeroSection = () => {
  const { config, isLoading } = useConfigStore();

  if (isLoading) return <HeroSkeleton />;
  if (!config?.hero) return null;

  const { heroType, fixedContent, carouselContent } = config.hero;

  if (heroType === "carousel") {
    return <HeroCarousel items={carouselContent} />;
  }

  return <HeroFixed items={fixedContent} />;
};

export default HeroSection;
