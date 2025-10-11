'use client';

import Link from 'next/link';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseData, CourseStatus } from "@/app/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

const statusColors: Record<CourseStatus, string> = {
    Active: "bg-blue-100 text-blue-800",
    Finished: "bg-gray-100 text-gray-800",
    Paused: "bg-yellow-100 text-yellow-800",
}

export default function CoursesPage() {
  const [courses, setCourses] = useState(courseData);

  useEffect(() => {
    // Check local storage for each course and update progress
    const updatedCourses = courseData.map(course => {
      const isCompleted = localStorage.getItem(`course_completed_${course.id}`) === 'true';
      if (isCompleted) {
        return { ...course, progress: 100, status: 'Finished' as CourseStatus };
      }
      return course;
    });
    setCourses(updatedCourses);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-headline">All Courses</h1>
                <p className="text-muted-foreground">Browse all your available courses below.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => {
                    const progress = course.progress;
                    return (
                        <Link href={`/courses/${course.id}`} key={course.id} className="no-underline">
                            <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <Badge className={`w-fit ${statusColors[course.status]}`}>{course.status}</Badge>
                                    <CardTitle className="pt-2">{course.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground mb-2">{progress}% Hoàn thành</p>
                                    <Progress value={progress} className="h-2" />
                                </CardContent>
                                <CardFooter>
                                   <Button variant="outline" className="w-full">
                                    {progress === 100 ? 'Xem lại' : progress > 0 ? 'Tiếp tục học' : 'Bắt đầu học'}
                                   </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
