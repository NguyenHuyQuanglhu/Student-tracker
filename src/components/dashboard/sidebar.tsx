'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

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
  
  if (isUserLoading || !user) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                <p className="text-muted-foreground">Đang tải dữ liệu người dùng...</p>
            </div>
        </div>
    )
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
            <Link href="/" className="flex items-center gap-3 no-underline">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white text-xl font-bold">H</div>
                <span className="text-xl font-bold text-sidebar-foreground">huy quang</span>
            </Link>
        </SidebarHeader>
        <SidebarContent className="flex-grow">
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
