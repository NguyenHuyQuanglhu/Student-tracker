'use client';

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AcademicWarnings } from "@/components/dashboard/academic-warnings";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { SoftSkillsDashboard } from "@/components/dashboard/soft-skills";
import { TodoList } from "@/components/dashboard/todo-list";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { YourCourses } from "@/components/dashboard/your-courses";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-6">
          <div className="space-y-6">
            <WelcomeBanner />
            <YourCourses />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProgressOverview />
              </div>
              <div className="flex flex-col gap-6">
                <AcademicWarnings />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <TodoList />
              </div>
               <SoftSkillsDashboard />
            </div>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
