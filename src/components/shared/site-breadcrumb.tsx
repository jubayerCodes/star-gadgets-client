import Link from "next/link";
import { Home } from "lucide-react";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SiteBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function SiteBreadcrumb({ items, className }: SiteBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="size-3.5" />
            Home
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <React.Fragment key={i}>
              <li aria-hidden="true" className="select-none">
                /
              </li>
              {isLast || !item.href ? (
                <li className="text-foreground font-medium" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </li>
              ) : (
                <li>
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
