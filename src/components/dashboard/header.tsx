'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Search, Bell } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "../ui/sidebar";

export function DashboardHeader() {
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [fallback, setFallback] = useState('A');
  const [userName, setUserName] = useState('TS. Nguyễn Văn An');

  useEffect(() => {
    const updateAvatarDisplay = () => {
        const storedAvatar = localStorage.getItem('profileAvatarUrl');
        const profileName = localStorage.getItem('profileName') || 'TS. Nguyễn Văn An';
        
        setUserName(profileName);

        if (storedAvatar) {
            setAvatarUrl(storedAvatar);
        } else if (user?.photoURL) {
            setAvatarUrl(user.photoURL);
        } else {
            setAvatarUrl(undefined);
        }

        if (user) {
            setFallback(user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'A');
            setUserName(user.displayName || profileName);
        } else {
            setFallback(profileName.charAt(0).toUpperCase());
        }
    };
    
    updateAvatarDisplay();

    window.addEventListener('profileImageChanged', updateAvatarDisplay);
    
    return () => {
        window.removeEventListener('profileImageChanged', updateAvatarDisplay);
    };
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="lg:hidden" />
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên, khóa học..."
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent w-80 bg-background"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
        </button>
        
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-3 cursor-pointer">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-muted-foreground">Giảng viên</p>
                </div>
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="User Avatar" />}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile" passHref>
                  <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Hồ sơ</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/settings" passHref>
                  <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Cài đặt</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}