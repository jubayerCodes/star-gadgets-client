import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import React from "react";

const DashboardButton = ({
  children,
  className,
  size,
  variant,
}: {
  children: React.ReactNode;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) => {
  return (
    <Button variant={variant} size={size} className={cn("rounded-md!", className)}>
      {children}
    </Button>
  );
};

export default DashboardButton;
