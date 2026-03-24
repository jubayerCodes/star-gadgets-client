import z from "zod";

export const updateHeaderConfigValidation = z.object({
  header: z.object({
    navLinks: z.array(z.string()),
  }),
});

export type UpdateHeaderConfigFormData = z.infer<typeof updateHeaderConfigValidation>;