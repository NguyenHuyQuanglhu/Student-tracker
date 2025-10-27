'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  Users,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  FileText,
  BarChart3,
  X
} from 'lucide-react';
import { DashboardHeader } from "@/components/dashboard/header";
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';

// This is the new layout component that wraps the SidebarProvider
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar>{children}</DashboardSidebar>
    </SidebarProvider>
  )
}


function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { setOpenMobile } = useSidebar();
  const auth = useAuth();


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const navigation = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Quản Lý Khóa Học', href: '/courses', icon: BookOpen },
    { name: 'Quản Lý Lớp Học', href: '/classes', icon: GraduationCap },
    { name: 'Quản Lý Bài Tập', href: '/exercises', icon: FileText },
    { name: 'Theo Dõi Sinh Viên', href: '/students', icon: Users },
    { name: 'Báo Cáo', href: '/reports', icon: BarChart3 },
    { name: 'Cài Đặt', href: '/settings', icon: Settings },
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const SidebarItems = () => (
     <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-3 no-underline">
            <div className="h-8 w-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-primary/80 text-transparent bg-clip-text">huy quang</span>
          </Link>
          <button onClick={() => setOpenMobile(false)} className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 flex-grow">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-foreground/70 hover:bg-accent hover:text-foreground'
                  }`}
                  onClick={() => setOpenMobile(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? 'text-primary' : 'text-muted-foreground'}`} />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-muted-foreground rounded-lg hover:bg-accent transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
            Đăng Xuất
          </button>
        </div>
     </div>
  );

  return (
    <>
      <Sidebar variant="sidebar" collapsible="offcanvas" className="bg-background shadow-lg border-r flex flex-col">
          <SidebarItems />
      </Sidebar>
      <div className="lg:pl-64 flex flex-col flex-1">
        <DashboardHeader />
        {children}
      </div>
    </>
  );
}