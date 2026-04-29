"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, Truck, KeyRound, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";
import { useLogoutUser } from "../hooks/useAccount";
import { useDeleteModalStore } from "@/store/deleteModalStore";
import { LogOutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

const sidebarLinks = [
  { label: "Profile", href: "/account", icon: User, exact: true },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Billing Address", href: "/account/billing-address", icon: MapPin },
  { label: "Shipping Address", href: "/account/shipping-address", icon: Truck },
  { label: "Change Password", href: "/account/change-password", icon: KeyRound },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const { mutateAsync: logoutUser } = useLogoutUser();
  const { openModal } = useDeleteModalStore();
  const { user } = useAuthStore();

  const isAdmin = !!user && ADMIN_ROLES.includes(user.role);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">My Account</p>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col divide-y divide-border">
          {/* Admin-only: Dashboard link */}
          {isAdmin && (
            <Link
              href="/dashboard"
              className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-2 border-l-transparent"
            >
              <span className="flex items-center gap-3">
                <LayoutDashboard className="size-4 shrink-0 text-primary" />
                Go to Dashboard
              </span>
            </Link>
          )}

          {/* Regular account links */}
          {sidebarLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between gap-3 px-5 py-3.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/5 text-primary border-l-2 border-l-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground border-l-2 border-l-transparent",
                )}
              >
                <span className="flex items-center gap-3">
                  <link.icon className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                  {link.label}
                </span>
                {active && <ChevronRight className="size-3.5 text-primary" />}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={() =>
              openModal({
                icon: LogOutIcon,
                title: "Logout",
                description: "Are you sure you want to logout?",
                confirmText: "Logout",
                onConfirm: async () => {
                  await logoutUser();
                },
              })
            }
            className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive border-l-2 border-l-transparent transition-colors cursor-pointer"
          >
            <LogOut className="size-4 shrink-0" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
