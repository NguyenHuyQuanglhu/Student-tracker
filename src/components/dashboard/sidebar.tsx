'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Book,
  User,
  Settings,
  ClipboardList,
} from 'lucide-react';
import { DashboardHeader } from "@/components/dashboard/header";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: Book },
    { href: '/exercises', label: 'Assignment', icon: ClipboardList },
    { href: '/profile', label: 'User', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
            <Link href="/" className="flex items-center gap-3 no-underline">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white text-xl font-bold">A</div>
                <span className="text-xl font-bold text-sidebar-foreground">Akademi</span>
            </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton asChild isActive={isActive(item.href)} className="text-base" variant="ghost">
                      <div>
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </div>
                    </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
