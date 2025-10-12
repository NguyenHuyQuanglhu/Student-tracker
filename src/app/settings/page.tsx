
'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleResetProgress = () => {
    try {
      if (typeof window !== 'undefined') {
        // Course and exercise progress
        localStorage.removeItem('courseProgress');
        localStorage.removeItem('exerciseState');
        
        // Dynamic data
        localStorage.removeItem('dynamicWarnings');
        localStorage.removeItem('skillMastery');

        // Profile customizations
        localStorage.removeItem('profileAvatarUrl');
        localStorage.removeItem('profileCoverUrl');
        
        toast({
          title: "Thành công!",
          description: "Toàn bộ tiến trình đã được đặt lại. Đang tải lại trang...",
        });

        // Dispatch events to update components immediately before reload
        window.dispatchEvent(new CustomEvent('courseStateChanged'));
        window.dispatchEvent(new CustomEvent('exerciseStateChanged'));
        window.dispatchEvent(new CustomEvent('warningsChanged'));
        window.dispatchEvent(new CustomEvent('skillMasteryChanged'));
        window.dispatchEvent(new CustomEvent('profileImageChanged')); // For header/profile avatar

        // Reload the page to ensure all components reset from a clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đã có lỗi xảy ra",
        description: "Không thể đặt lại tiến trình. Vui lòng thử lại.",
      });
      console.error("Failed to reset progress:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4">
          <div className="mx-auto max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Cài đặt</CardTitle>
                <CardDescription>Định cấu hình tùy chọn ứng dụng của bạn.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Giao diện</h3>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode" className="text-base">Chế độ tối</Label>
                      <p className="text-sm text-muted-foreground">
                        Bật để chuyển sang giao diện tối.
                      </p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Đặt lại tiến trình</h3>
                  <p className="text-sm text-muted-foreground">
                    Thao tác này sẽ xóa tất cả dữ liệu về tiến độ khóa học và bài tập của bạn. 
                    Hành động này không thể được hoàn tác.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Đặt lại toàn bộ tiến trình</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này sẽ xóa vĩnh viễn tất cả tiến trình khóa học và bài tập của bạn. 
                          Dữ liệu này không thể được khôi phục.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetProgress}>Tiếp tục</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
