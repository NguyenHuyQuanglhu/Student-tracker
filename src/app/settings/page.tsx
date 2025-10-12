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

export default function SettingsPage() {
  const { toast } = useToast();

  const handleResetProgress = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('courseProgress');
        sessionStorage.removeItem('exerciseState');
        
        toast({
          title: "Thành công!",
          description: "Toàn bộ tiến trình đã được đặt lại. Đang tải lại trang...",
        });

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
        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Cài đặt</CardTitle>
                <CardDescription>Định cấu hình tùy chọn ứng dụng của bạn.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Đặt lại tiến trình</h3>
                    <p className="text-sm text-muted-foreground">
                      Thao tác này sẽ xóa tất cả dữ liệu về tiến độ khóa học và bài tập của bạn. 
                      Hành động này không thể được hoàn tác.
                    </p>
                  </div>
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
                <div className="text-center py-12 mt-8">
                  <h3 className="text-lg font-semibold">Các cài đặt khác sắp có!</h3>
                  <p className="text-muted-foreground">Bạn sẽ sớm có thể điều chỉnh các cài đặt khác của mình tại đây.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
