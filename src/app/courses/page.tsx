import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { todoList } from "@/app/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function CoursesPage() {
  // Group exercises by course
  const courses = todoList.reduce((acc, item) => {
    (acc[item.course] = acc[item.course] || []).push(item);
    return acc;
  }, {} as Record<string, typeof todoList>);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="space-y-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold font-headline">Các khóa học của bạn</h1>
                    <p className="text-muted-foreground">Đây là các bài tập và nhiệm vụ cho các khóa học bạn đã đăng ký.</p>
                </div>

                {Object.entries(courses).map(([courseName, exercises]) => (
                    <Card key={courseName}>
                    <CardHeader>
                        <CardTitle className="font-headline">{courseName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                        {exercises.map((exercise) => (
                            <li
                            key={exercise.id}
                            className={`flex items-center justify-between rounded-lg border p-4 ${
                                exercise.completed ? "bg-muted/50" : ""
                            }`}
                            >
                            <div className="flex items-center space-x-4">
                                <Checkbox id={`task-${exercise.id}`} checked={exercise.completed} aria-label={`Mark ${exercise.task} as complete`} />
                                <label
                                htmlFor={`task-${exercise.id}`}
                                className={`font-medium ${
                                    exercise.completed ? "text-muted-foreground line-through" : ""
                                }`}
                                >
                                {exercise.task}
                                </label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Badge variant={exercise.completed ? "secondary" : "outline"}>
                                Hạn trong {exercise.dueDate}
                                </Badge>
                            </div>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
