import React from "react";
import DashboardButton from "./dashboard-button";
import DashboardHeader from "./dashboard-header";
import { FieldValues, UseFormReturn } from "react-hook-form";

interface DashboardConfigHeaderProps<T extends FieldValues> {
  title: string;
  description: string;
  isPending: boolean;
  form: UseFormReturn<T>;
}

function DashboardConfigHeader<T extends FieldValues>({
  title,
  description,
  isPending,
  form,
}: DashboardConfigHeaderProps<T>) {
  return (
    <div>
      <DashboardHeader title={title} description={description}>
        <DashboardButton type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? "Saving..." : "Save"}
        </DashboardButton>
      </DashboardHeader>
    </div>
  );
}

export default DashboardConfigHeader;
