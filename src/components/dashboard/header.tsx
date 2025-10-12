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
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

export function DashboardHeader() {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [fallback, setFallback] = useState('A');

  const updateAvatar = () => {
      if (typeof window === 'undefined') return;
      
      const storedAvatar = sessionStorage.getItem('profileAvatarUrl');
      const defaultAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

      setAvatarUrl(storedAvatar || defaultAvatar?.imageUrl);

      const profileName = sessionStorage.getItem('profileName') || 'Alex Doe';
      setFallback(profileName.charAt(0).toUpperCase());
  };

  useEffect(() => {
    updateAvatar();
    
    window.addEventListener('profileImageChanged', updateAvatar);
    
    return () => {
        window.removeEventListener('profileImageChanged', updateAvatar);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex items-center gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-12 w-12">
                    <Avatar className="h-10 w-10">
                      {avatarUrl && <AvatarImage src={avatarUrl} alt="User Avatar" />}
                      <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
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
                 <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
