'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Pencil, Camera } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState, useEffect } from "react";
import { type ImagePlaceholder } from "@/lib/placeholder-images";


export default function ProfilePage() {
    const [coverImage, setCoverImage] = useState<ImagePlaceholder | undefined>();
    const [profileAvatar, setProfileAvatar] = useState<ImagePlaceholder | undefined>();

    useEffect(() => {
        setCoverImage(PlaceHolderImages.find(p => p.id === 'profile-cover'));
        setProfileAvatar(PlaceHolderImages.find(p => p.id === 'profile-avatar'));
    }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-2xl">
            <Card className="overflow-hidden">
                <div className="relative">
                    {coverImage && (
                        <Image
                            src={coverImage.imageUrl}
                            alt="Cover image"
                            width={800}
                            height={300}
                            className="w-full h-48 object-cover"
                            data-ai-hint={coverImage.imageHint}
                        />
                    )}
                    <div className="absolute bottom-0 left-6 translate-y-1/2">
                        <div className="relative">
                            <Avatar className="h-28 w-28 border-4 border-card">
                                {profileAvatar && (
                                     <AvatarImage src={profileAvatar.imageUrl} alt="Capybara" data-ai-hint={profileAvatar.imageHint}/>
                                )}
                                <AvatarFallback>C</AvatarFallback>
                            </Avatar>
                             <Button size="icon" variant="secondary" className="absolute bottom-1 right-1 h-8 w-8 rounded-full">
                                <Camera className="h-4 w-4" />
                                <span className="sr-only">Change profile picture</span>
                            </Button>
                        </div>
                    </div>
                </div>

              <CardContent className="pt-20 px-6 pb-6">
                 <div className="flex items-center gap-2 mb-8">
                    <h1 className="text-2xl font-bold">Capybara</h1>
                    <Button variant="ghost" size="icon">
                        <Pencil className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Thông tin cá nhân</h2>
                    <div className="space-y-4 text-sm">
                        <div className="grid grid-cols-3 gap-4">
                            <span className="text-muted-foreground">Giới tính</span>
                            <span className="col-span-2 font-medium">Nam</span>
                        </div>
                         <div className="grid grid-cols-3 gap-4">
                            <span className="text-muted-foreground">Ngày sinh</span>
                            <span className="col-span-2 font-medium">03 tháng 03, 2004</span>
                        </div>
                         <div className="grid grid-cols-3 gap-4">
                            <span className="text-muted-foreground">Điện thoại</span>
                            <div className="col-span-2">
                                <span className="font-medium">+84 588 845 537</span>
                                <p className="text-xs text-muted-foreground mt-1">Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex justify-center">
                    <Button>
                        <Pencil className="mr-2 h-4 w-4"/>
                        Cập nhật
                    </Button>
                </div>

              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
