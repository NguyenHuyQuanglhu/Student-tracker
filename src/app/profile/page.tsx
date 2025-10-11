import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Profile</CardTitle>
                <CardDescription>View and manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">Coming Soon!</h3>
                  <p className="text-muted-foreground">This page is under construction. You'll be able to manage your profile here soon.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
