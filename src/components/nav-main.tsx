"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { INavItem } from "./app-sidebar";
import { useEffect, useState } from "react";

export function NavMain({ items }: { items: INavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, idx) => (
            <NavItem key={idx} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// export const NavItem = ({
//   item,
// }: {
//   item: { title: string; url?: string; icon?: Icon; items?: { title: string; url: string }[] };
// }) => {
//   const pathname = usePathname();
//   const { activeTab, setActiveTab } = useNavbarTab();

//   useEffect(() => {
//     if (pathname !== "/" && Array.isArray(item.items) && item.items.length > 0) {
//       if (item?.url?.startsWith(pathname) || item?.items?.some((i) => i.url?.startsWith(pathname))) {
//         setActiveTab(item.title);
//       }
//     }
//   }, [pathname, item, setActiveTab]);

//   return (
//     <Collapsible
//       asChild
//       defaultOpen={item.url?.startsWith(pathname) || item?.items?.some((i) => i.url?.startsWith(pathname))}
//       open={activeTab === item.title}
//       className="group/collapsible"
//     >
//       <SidebarMenuItem>
//         <CollapsibleTrigger asChild>
//           <SidebarMenuButton
//             asChild={!!item.url}
//             tooltip={item.title}
//             onClick={() => setActiveTab(activeTab === item.title ? undefined : item.title)}
//             className="hover:bg-accent/10! hover:text-accent! data-[state=open]:bg-accent/10! data-[state=open]:hover:bg-accent/20! data-[state=open]:hover:text-accent! rounded!"
//           >
//             {item.url ? (
//               <Link href={item.url}>
//                 {item.icon && <item.icon />}
//                 <span>{item.title}</span>
//                 {item.items && (
//                   <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                 )}
//               </Link>
//             ) : (
//               <>
//                 {item.icon && <item.icon />}
//                 <span>{item.title}</span>
//                 {item.items && (
//                   <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                 )}
//               </>
//             )}
//           </SidebarMenuButton>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <SidebarMenuSub>
//             {item.items?.map((subItem) => (
//               <SidebarMenuSubItem key={subItem.title}>
//                 <SidebarMenuSubButton asChild>
//                   <a href={subItem.url}>
//                     <span>{subItem.title}</span>
//                   </a>
//                 </SidebarMenuSubButton>
//               </SidebarMenuSubItem>
//             ))}
//           </SidebarMenuSub>
//         </CollapsibleContent>
//       </SidebarMenuItem>
//     </Collapsible>
//   );
// };

const NavItem = ({ item }: { item: INavItem }) => {
  const pathname = usePathname();

  const isTabActive = item?.children?.some((i) => i.url === pathname);
  const [tabOpen, setTabOpen] = useState(isTabActive);

  useEffect(() => {
    setTabOpen(isTabActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (item.children) {
    return (
      <Collapsible
        key={item.title}
        defaultOpen={tabOpen}
        open={tabOpen}
        onOpenChange={setTabOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem className="group-data-[state=open]/collapsible:bg-sidebar-primary/10 rounded-sm">
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className="cursor-pointer group-data-[state=open]/collapsible:text-sidebar group-data-[state=open]/collapsible:bg-sidebar-primary hover:bg-sidebar-primary/10! hover:text-sidebar-primary! group-data-[state=open]/collapsible:hover:bg-sidebar-primary! group-data-[state=open]/collapsible:hover:text-sidebar! h-8 rounded-sm!"
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="w-full transition-[padding]">
            <SidebarMenuSub
              className={cn(
                "transition-[padding,border] m-0 px-0.5 border-0 block translate-x-0 group-data-[state=open]/collapsible:py-0.5 in-data-[state=collapsed]:pl-0 in-data-[state=collapsed]:border-l-0 space-y-0.5!",
              )}
            >
              {item.children?.map((subItem, idx) => (
                <NavLink key={idx} subItem={true} item={subItem} className="pl-5!" />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return <NavLink item={item} />;
};

export const NavLink = ({ item, className, subItem }: { item: INavItem; className?: string; subItem?: boolean }) => {
  const pathname = usePathname();
  const isActive = item.url === pathname;
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={cn(
          "hover:bg-sidebar-primary/5! hover:text-sidebar-primary! h-8 rounded-sm!",
          isActive && "bg-sidebar-primary text-sidebar hover:bg-sidebar-primary! hover:text-sidebar!",
          subItem &&
            isActive &&
            "bg-sidebar/70 text-sidebar-foreground hover:bg-sidebar-primary/5! hover:text-sidebar-foreground!",
          className,
        )}
        tooltip={item.title}
        asChild
      >
        <Link href={item.url!}>
          {item.icon && <item.icon />}
          {state !== "collapsed" && <span>{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
