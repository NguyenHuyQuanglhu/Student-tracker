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
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Book,
  User,
  Settings,
} from 'lucide-react';
import { DashboardHeader } from "@/components/dashboard/header";

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Bảng điều khiển', icon: LayoutDashboard },
    { href: '/courses', label: 'Các khóa học', icon: Book },
    { href: '/profile', label: 'Hồ sơ', icon: User },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6" />
                      <path d="M2 10v6" />
                      <path d="M12 2v8" />
                      <path d="m6 12 6 6 6-6" />
                      <path d="M6 18h12" />
                    </svg>
                </div>
                <span className="text-lg font-semibold">Góc học tập</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <div>
                        <item.icon />
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
