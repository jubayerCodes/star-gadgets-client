"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import z from "zod";

import DashboardConfigHeader from "@/components/dashboard/dashbaord-config-header";
import DashboardButton from "@/components/dashboard/dashboard-button";
import { useGetConfig } from "../../hooks/useConfig";
import { useUpdateShippingConfig } from "../../hooks/useShippingConfig";
import DashboardInputField from "@/components/form/dashboard/dashboard-input-field";

const shippingMethodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.coerce.number({ error: "Cost is required" }).min(0, "Cost must be 0 or more"),
});

const shippingConfigFormSchema = z.object({
  shippingMethods: z.array(shippingMethodSchema).min(1, "At least one shipping method is required"),
});

type ShippingConfigFormInput = z.input<typeof shippingConfigFormSchema>;
type ShippingConfigFormData = z.infer<typeof shippingConfigFormSchema>;

export function ShippingConfigForm() {
  const { data: config } = useGetConfig();
  const { mutateAsync: updateShippingConfig, isPending } = useUpdateShippingConfig();

  const form = useForm<ShippingConfigFormInput, unknown, ShippingConfigFormData>({
    resolver: zodResolver(shippingConfigFormSchema),
    defaultValues: {
      shippingMethods: [
        { name: "Inside Dhaka", cost: 60 },
      ],
    },
  });

  // Populate form from server data
  useEffect(() => {
    if (config?.data?.shippingMethods) {
      form.reset({ shippingMethods: config.data.shippingMethods });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "shippingMethods",
  });

  const handleSubmit = (data: ShippingConfigFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    updateShippingConfig({ id: config?.data._id!, data });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <DashboardConfigHeader
          title="Shipping Methods"
          description="Manage shipping methods and their costs"
          isPending={isPending}
          form={form}
        />

        <div className="rounded-lg border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Shipping Methods</h3>
              <p className="text-sm text-muted-foreground">
                Add shipping areas and set the cost for each.
              </p>
            </div>
            <DashboardButton
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", cost: 0 })}
            >
              <Plus className="size-4" />
              Add Method
            </DashboardButton>
          </div>

          {form.formState.errors.shippingMethods?.message && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.shippingMethods.message}
            </p>
          )}

          {fields.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-input py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">No shipping methods yet</p>
              <p className="text-xs text-muted-foreground/70">
                Click &quot;Add Method&quot; to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_160px_auto] gap-3 items-end"
                >
                  <DashboardInputField
                    form={form}
                    name={`shippingMethods.${index}.name`}
                    label="Area Name"
                    placeholder="e.g. Inside Dhaka"
                    required
                  />
                  <DashboardInputField
                    form={form}
                    name={`shippingMethods.${index}.cost`}
                    label="Cost (৳)"
                    placeholder="e.g. 60"
                    type="number"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mb-0.5 flex size-10 items-center justify-center rounded-sm border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    aria-label="Remove shipping method"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default ShippingConfigForm;
