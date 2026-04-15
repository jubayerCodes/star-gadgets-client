"use client";

import { useConfigStore } from "@/store/configStore";
import dynamic from "next/dynamic";
import { HeroCarouselSkeleton, HeroFixedSkeleton } from "./hero-skeleton";

const HeroFixed = dynamic(() => import("./hero-fixed"), {
  ssr: false,
  loading: () => <HeroFixedSkeleton />,
});

const HeroCarousel = dynamic(() => import("./hero-carousel"), {
  ssr: false,
  loading: () => <HeroCarouselSkeleton />,
});


const HeroSection = () => {
  const { config, isLoading } = useConfigStore();

  if (isLoading || !config?.hero) {
    return <HeroFixedSkeleton />;
  }

  const { heroType, fixedContent, carouselContent } = config.hero;

  if (heroType === "carousel") {
    return <HeroCarousel items={carouselContent} />;
  }

  return <HeroFixed items={fixedContent} />;
};

export default HeroSection;
