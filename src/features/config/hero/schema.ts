import z from "zod";

const heroFixedItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().min(1, "Link is required"),
});

const heroCarouselItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  button: z.string().min(1, "Button label is required"),
  buttonLink: z.string().min(1, "Button link is required"),
});

export const heroItemSchema = z.union([heroFixedItemSchema, heroCarouselItemSchema]);

export const updateHeroConfigValidation = z.object({
  hero: z.object({
    heroType: z.enum(["fixed", "carousel"]),
    heroContent: z.array(
      z.object({
        id: z.string().min(1, "ID is required"),
        image: z.string().min(1, "Image is required"),
        link: z.string().optional(),
        button: z.string().optional(),
        buttonLink: z.string().optional(),
      }),
    ),
  }),
});

export type UpdateHeroConfigFormData = z.infer<typeof updateHeroConfigValidation>;

export type HeroItemFormData = {
  id: string;
  image: string;
  link?: string;
  button?: string;
  buttonLink?: string;
};

export interface UpdateHeroConfigPayload {
  hero: {
    heroType: "fixed" | "carousel";
    heroContent: HeroItemFormData[];
  };
}
