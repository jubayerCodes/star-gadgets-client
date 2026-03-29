import { z } from "zod";
import { updateHeroConfigValidation } from "./schema";

export type UpdateHeroConfigFormData = z.infer<typeof updateHeroConfigValidation>;

export type HeroFixedItemFormData = {
  id: string;
  image: string;
  link?: string;
  button?: string;
  buttonLink?: string;
};

export type HeroCarouselItemFormData = {
  id: string;
  image: string;
  link?: string;
  button?: string;
  buttonLink?: string;
};

// Merged type used for generic parts of forms (e.g. HeroItemFields props)
export type HeroItemFormData = HeroFixedItemFormData & HeroCarouselItemFormData;

export interface UpdateHeroConfigPayload {
  hero: {
    heroType: "fixed" | "carousel";
    fixedContent: HeroFixedItemFormData[];
    carouselContent: HeroCarouselItemFormData[];
  };
}
