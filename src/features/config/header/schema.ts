import z from "zod";

export const updateHeaderConfigValidation = z.object({
  header: z.object({
    navLinks: z.array(z.object({ _id: z.string(), title: z.string() })),
  }),
});

export type UpdateHeaderConfigFormData = z.infer<typeof updateHeaderConfigValidation>;

export interface UpdateHeaderConfigPayload {
  header: {
    navLinks: string[];
  };
}