import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
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
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">Sắp có!</h3>
                  <p className="text-muted-foreground">Trang này đang được xây dựng. Bạn sẽ sớm có thể điều chỉnh cài đặt của mình tại đây.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
