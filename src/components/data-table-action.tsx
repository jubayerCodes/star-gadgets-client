import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import type { IconType } from "react-icons/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import DashboardButton from "./dashboard/dashboard-button";

export interface DataTableOption {
  label: string;
  icon: IconType;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  hide?: boolean;
  className?: string;
  variant?: "default" | "destructive";
  children?: DataTableOption[];
  target?: "_blank" | "_self" | "_parent" | "_top";
}

interface DataTableActionProps {
  options: DataTableOption[];
  align?: "start" | "center" | "end";
}

export const DataTableAction: React.FC<DataTableActionProps> = ({ options, align = "end" }) => {
  const visibleOptions = options.filter((option) => !option.hide);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <DashboardButton variant="dashboardGhost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DashboardButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-52">
        {visibleOptions.map((option, index) => {
          const Icon = option.icon;

          if (option.children && option.children.length > 0) {
            return (
              <DropdownMenuSub key={index}>
                <DropdownMenuSubTrigger className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {option.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {option.children
                    .filter((child) => !child.hide)
                    .map((child, childIndex) => {
                      const ChildIcon = child.icon;
                      return (
                        <DropdownMenuItem
                          key={childIndex}
                          onClick={child.onClick}
                          disabled={child.disabled}
                          className={cn("flex items-center gap-2 cursor-pointer", child.className)}
                        >
                          <ChildIcon className="h-4 w-4 text-muted-foreground" />
                          {child.label}
                        </DropdownMenuItem>
                      );
                    })}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          }

          if (option.href) {
            return (
              <DropdownMenuItem
                key={index}
                disabled={option.disabled}
                asChild
                className={cn("flex w-full items-center gap-2 cursor-pointer", option.className)}
              >
                <Link target={option.target || "_self"} href={option.href} onClick={option.onClick}>
                  <Icon className="h-4 w-4 text-inherit" />
                  {option.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={index}
              onClick={option.onClick}
              disabled={option.disabled}
              className={cn("flex items-center gap-2 cursor-pointer", option.className)}
              variant={option.variant}
            >
              <Icon className="h-4 w-4 text-inherit" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
