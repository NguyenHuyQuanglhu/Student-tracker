
'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useEffect, useState } from "react";
import type { ImagePlaceholder } from "@/lib/placeholder-images";

export function DashboardHeader() {
  const [avatar, setAvatar] = useState<ImagePlaceholder | undefined>();

  useEffect(() => {
    const avatarImg = PlaceHolderImages.find(p => p.id === 'user-avatar');
    setAvatar(avatarImg);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex items-center gap-2">
        <Link href="/profile" passHref>
           <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              {avatar && <AvatarImage src={avatar.imageUrl} alt="User Avatar" />}
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span className="sr-only">Hồ sơ</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
