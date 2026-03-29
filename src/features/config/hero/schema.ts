import { z } from "zod";

// ─── Per-item schemas ──────────────────────────────────────────────────────────

export const heroFixedItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().min(1, "Link is required"),
  button: z.string().optional(),
  buttonLink: z.string().optional(),
});

export const heroCarouselItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().optional(),
  button: z.string().min(1, "Button label is required"),
  buttonLink: z.string().min(1, "Button link is required"),
});

// ─── Form-level schema ────────────────────────────────────────────────────────

export const updateHeroConfigValidation = z.object({
  hero: z.object({
    heroType: z.enum(["fixed", "carousel"]),
    fixedContent: z.array(heroFixedItemSchema),
    carouselContent: z.array(heroCarouselItemSchema),
  }).superRefine((data, ctx) => {
    if (data.heroType === "fixed" && data.fixedContent.length !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fixed layout must have exactly 3 items",
        path: ["fixedContent"],
      });
    }
    if (data.heroType === "carousel" && data.carouselContent.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Carousel layout must have at least 1 item",
        path: ["carouselContent"],
      });
    }
  }),
});
