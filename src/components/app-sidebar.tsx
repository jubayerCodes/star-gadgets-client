"use client";

import * as React from "react";
import {
  Icon,
  IconDashboard,
  IconDeviceLaptop,
  IconHome,
  IconLayout2,
  IconListDetails,
  IconSettings,
  IconTicket,
  IconWorld,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import logoSm from "@/assets/logo-sm.png";

export interface INavItem {
  title: string;
  url?: string;
  icon?: Icon;
  children?: {
    title: string;
    url: string;
  }[];
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Back to Home",
      url: "/",
      icon: IconHome,
    },
  ],
};

const navMain: INavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Gallery",
    url: "/dashboard/gallery",
    icon: IconLayout2,
  },
  {
    title: "Products",
    icon: IconListDetails,
    children: [
      {
        title: "All Products",
        url: "/dashboard/products",
      },
      {
        title: "Add Product",
        url: "/dashboard/products/add",
      },
      {
        title: "Badges",
        url: "/dashboard/products/badges",
      },
    ],
  },
  {
    title: "Categories",
    icon: IconDeviceLaptop,
    children: [
      {
        title: "Categories",
        url: "/dashboard/categories",
      },
      {
        title: "Sub Categories",
        url: "/dashboard/sub-categories",
      },
    ],
  },
  {
    title: "Brands",
    url: "/dashboard/brands",
    icon: IconWorld,
  },
  {
    title: "Coupons",
    url: "/dashboard/coupons",
    icon: IconTicket,
  },
  {
    title: "Configurations",
    icon: IconSettings,
    children: [
      {
        title: "Header",
        url: "/dashboard/configurations/header",
      },
      {
        title: "Hero",
        url: "/dashboard/configurations/hero",
      },
      {
        title: "Shipping",
        url: "/dashboard/configurations/shipping",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard" className="h-auto!">
                {state === "collapsed" ? (
                  <Image src={logoSm} alt="Logo" width={40} height={40} />
                ) : (
                  <Image src={logo} alt="Logo" width={200} height={40} />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
