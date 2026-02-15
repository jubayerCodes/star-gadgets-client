import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { ClassValue } from "clsx";

type Props = {
  children: React.ReactNode;
  className?: ClassValue;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<typeof Button>;

const DashboardButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, className, size, variant, asChild, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        asChild={asChild}
        variant={variant}
        size={size}
        className={cn("rounded-md!", className)}
        {...props}
      >
        {children}
      </Button>
    );
  },
);

DashboardButton.displayName = "DashboardButton";

export default DashboardButton;
