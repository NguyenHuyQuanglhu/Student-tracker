
'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Pencil, Camera, Save, X } from "lucide-react";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";
import { useState, useEffect, useRef } from "react";

const initialProfileData = {
    fullName: "Nguyễn Văn A",
    studentId: "B20DCCN001",
    class: "D20CNPM1",
    school: "Học viện Công nghệ Bưu chính Viễn thông",
    major: "Công nghệ thông tin",
    gender: "Nam",
    dob: "03 tháng 03, 2004",
    phone: "+84 588 845 537",
    name: "Capybara"
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    
    const [coverImage, setCoverImage] = useState<ImagePlaceholder | undefined>();
    const [profileAvatar, setProfileAvatar] = useState<ImagePlaceholder | undefined>();
    
    const [tempCoverImageUrl, setTempCoverImageUrl] = useState<string | null>(null);
    const [tempAvatarImageUrl, setTempAvatarImageUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState(initialProfileData);

    const coverImageInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const coverImg = PlaceHolderImages.find(p => p.id === 'profile-cover');
        const avatarImg = PlaceHolderImages.find(p => p.id === 'profile-avatar');
        setCoverImage(coverImg);
        setProfileAvatar(avatarImg);
        if (coverImg) setTempCoverImageUrl(coverImg.imageUrl);
        if (avatarImg) setTempAvatarImageUrl(avatarImg.imageUrl);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'cover' | 'avatar') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (imageType === 'cover') {
                    setTempCoverImageUrl(reader.result as string);
                } else {
                    setTempAvatarImageUrl(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(initialProfileData);
        if(coverImage) setTempCoverImageUrl(coverImage.imageUrl);
        if(profileAvatar) setTempAvatarImageUrl(profileAvatar.imageUrl);
        setIsEditing(false);
    };

    const handleSave = () => {
        // Here you would typically send the data to a server
        // For now, we'll just update the initial data to simulate saving
        Object.assign(initialProfileData, formData);
        if (tempCoverImageUrl && coverImage) {
            coverImage.imageUrl = tempCoverImageUrl;
        }
        if (tempAvatarImageUrl && profileAvatar) {
            profileAvatar.imageUrl = tempAvatarImageUrl;
        }
        setIsEditing(false);
    };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-2xl">
            <Card className="overflow-hidden">
                <div className="relative">
                    {tempCoverImageUrl && (
                        <Image
                            src={tempCoverImageUrl}
                            alt="Cover image"
                            width={800}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    {isEditing && (
                        <>
                            <input 
                                type="file" 
                                ref={coverImageInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'cover')}
                            />
                            <Button 
                                size="icon" 
                                variant="secondary" 
                                className="absolute top-4 right-4 h-8 w-8 rounded-full"
                                onClick={() => coverImageInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <div className="absolute bottom-0 left-6 translate-y-1/2">
                        <div className="relative">
                            <Avatar className="h-28 w-28 border-4 border-card">
                                {tempAvatarImageUrl && (
                                     <AvatarImage src={tempAvatarImageUrl} alt="User Avatar" />
                                )}
                                <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             {isEditing && (
                                <>
                                    <input 
                                        type="file" 
                                        ref={avatarInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                    />
                                    <Button 
                                        size="icon" 
                                        variant="secondary" 
                                        className="absolute bottom-1 right-1 h-8 w-8 rounded-full"
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        <Camera className="h-4 w-4" />
                                        <span className="sr-only">Change profile picture</span>
                                    </Button>
                                </>
                             )}
                        </div>
                    </div>
                </div>

              <CardContent className="pt-20 px-6 pb-6">
                 <div className="flex items-center gap-2 mb-8">
                    {isEditing ? (
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="text-2xl font-bold h-auto p-0 border-0 shadow-none focus-visible:ring-0"
                        />
                    ) : (
                        <h1 className="text-2xl font-bold">{formData.name}</h1>
                    )}
                </div>

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2">Thông tin cá nhân</h2>
                    <div className="space-y-4 text-sm">
                        {[
                            { label: "Họ và tên", name: "fullName", value: formData.fullName },
                            { label: "Mã số sinh viên", name: "studentId", value: formData.studentId },
                            { label: "Lớp", name: "class", value: formData.class },
                            { label: "Trường", name: "school", value: formData.school },
                            { label: "Ngành", name: "major", value: formData.major },
                            { label: "Giới tính", name: "gender", value: formData.gender },
                            { label: "Ngày sinh", name: "dob", value: formData.dob },
                            { label: "Điện thoại", name: "phone", value: formData.phone, description: "Chỉ bạn bè có lưu số của bạn trong danh bạ máy xem được số này" }
                        ].map(field => (
                            <div key={field.name} className="grid grid-cols-3 gap-4 items-center">
                                <span className="text-muted-foreground">{field.label}</span>
                                <div className="col-span-2">
                                    {isEditing ? (
                                        <Input name={field.name} value={field.value} onChange={handleInputChange} className="h-8"/>
                                    ) : (
                                        <span className="font-medium">{field.value}</span>
                                    )}
                                    {field.description && !isEditing && (
                                        <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 flex justify-center gap-4">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4"/>
                                Lưu
                            </Button>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4"/>
                                Hủy
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleEdit}>
                            <Pencil className="mr-2 h-4 w-4"/>
                            Cập nhật
                        </Button>
                    )}
                </div>

              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}

    