"use client";

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
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Book,
  User,
  Settings,
  ClipboardList,
  LogOut,
  Users,
  Calendar,
  CircleDollarSign,
  Utensils,
  MessageSquare,
  Activity,
} from 'lucide-react';
import { DashboardHeader } from "@/components/dashboard/header";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Courses', icon: Book },
    { href: '/exercises', label: 'Assignment', icon: ClipboardList },
    { href: '/events', label: 'Event', icon: Calendar },
    { href: '/finance', label: 'Finance', icon: CircleDollarSign },
    { href: '/food', label: 'Food', icon: Utensils },
    { href: '/profile', label: 'User', icon: User },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/activity', label: 'Lastest Activity', icon: Activity },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white text-xl font-bold">A</div>
                <span className="text-xl font-bold text-sidebar-foreground">Akademi</span>
            </div>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu className="flex flex-col justify-start">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton asChild isActive={pathname === item.href} className="text-base" variant="ghost">
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
        <SidebarFooter className="text-xs text-sidebar-foreground/60 text-center">
            <p>Akademi - School Admission Dashboard</p>
            <p>Made with ❤️ by Peterdraw</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
