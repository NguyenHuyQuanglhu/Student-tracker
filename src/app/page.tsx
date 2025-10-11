import { DashboardHeader } from "@/components/dashboard/header";
import { EarlyWarnings } from "@/components/dashboard/early-warnings";
import { ExerciseSuggestions } from "@/components/dashboard/exercise-suggestions";
import { ProgressOverview } from "@/components/dashboard/progress-overview";
import { SoftSkillsDashboard } from "@/components/dashboard/soft-skills";
import { TodoList } from "@/components/dashboard/todo-list";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 sm:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProgressOverview />
            </div>
            <SoftSkillsDashboard />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TodoList />
            </div>
            <EarlyWarnings />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <ExerciseSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
}
