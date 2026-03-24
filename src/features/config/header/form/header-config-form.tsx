"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateHeaderConfigPayload, updateHeaderConfigValidation } from "../schema";
import { UpdateHeaderConfigFormData } from "../schema";
import { useFieldArray, useForm } from "react-hook-form";
import AddNavLinkModal from "../modals/add-navLink-modal";
import DashboardButton from "@/components/dashboard/dashboard-button";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useUpdateHeaderConfig } from "../../hooks/useHeaderConfig";
import { useGetConfig } from "../../hooks/useConfig";

function HeaderConfigForm() {
  const { data: config } = useGetConfig();

  const form = useForm<UpdateHeaderConfigFormData>({
    resolver: zodResolver(updateHeaderConfigValidation),
    defaultValues: {
      header: {
        navLinks: config?.data?.header?.navLinks || [],
      },
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "header.navLinks",
  });

  const { mutateAsync: updateHeaderConfig, isPending } = useUpdateHeaderConfig();

  const handleSubmit = (data: UpdateHeaderConfigFormData) => {
    const payload: UpdateHeaderConfigPayload = {
      header: {
        navLinks: data.header.navLinks.map((link) => link._id),
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    updateHeaderConfig({ id: config?.data._id!, data: payload });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
        <DashboardHeader title="Header Configurations" description="Manage your header configurations">
          <DashboardButton type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </DashboardButton>
        </DashboardHeader>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Nav Links</h3>
            <AddNavLinkModal form={form} />
          </div>
          <div className="flex flex-wrap gap-2">
            {fields.map((field, idx) => (
              <DashboardButton key={field._id} size={"sm"} variant={"outline"} onClick={() => remove(idx)}>
                {field.title}
              </DashboardButton>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default HeaderConfigForm;
