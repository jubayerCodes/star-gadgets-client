"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateHeaderConfigValidation } from "../schema";
import { UpdateHeaderConfigFormData } from "../schema";
import { useForm } from "react-hook-form";
import AddNavLinkModal from "../modals/add-navLink-modal";

function HeaderConfigForm() {
  const form = useForm<UpdateHeaderConfigFormData>({
    resolver: zodResolver(updateHeaderConfigValidation),
    defaultValues: {
      header: {
        navLinks: [],
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="mb-4 text-lg font-medium">Nav Links</h3>
          <AddNavLinkModal form={form} />
        </div>
      </div>
    </div>
  );
}

export default HeaderConfigForm;
