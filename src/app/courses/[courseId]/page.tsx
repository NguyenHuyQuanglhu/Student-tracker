'use client';

import { useState, useEffect, use } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { courseData } from "@/app/lib/mock-data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseDetailPage({ params: paramsPromise }: { params: { courseId: string } }) {
  const params = use(paramsPromise);
  const courseId = params.courseId;
  
  const [course, setCourse] = useState(() => courseData.find(c => c.id === courseId));
  
  useEffect(() => {
    const handleCourseCompletion = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { courseId: completedCourseId } = customEvent.detail;
      if (completedCourseId === courseId) {
        setCourse(prevCourse => prevCourse ? { ...prevCourse, progress: 100 } : undefined);
      }
    };

    window.addEventListener('courseCompleted', handleCourseCompletion);

    return () => {
      window.removeEventListener('courseCompleted', handleCourseCompletion);
    };
  }, [courseId]);


  if (!course) {
    notFound();
  }

  const isCompleted = course.progress === 100;

  const handleMarkAsComplete = () => {
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('courseCompleted', { detail: { courseId } }));
  };

  const progress = course.progress;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
            <div className="mb-6">
                 <Link href="/courses" passHref>
                    <Button variant="outline" size="sm" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay lại trang chính
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold font-headline">Khóa học: {course.name}</h1>
                <p className="text-muted-foreground">Đây là trang chi tiết cho khóa học của bạn.</p>
            </div>
          <div className="mx-auto max-w-7xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Nội dung khóa học</CardTitle>
                <CardDescription>Tiến độ hiện tại của bạn: {progress}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">Nội dung sắp ra mắt!</h3>
                  <p className="text-muted-foreground">Các bài học và tài liệu cho khóa học này đang được xây dựng.</p>
                  <Button 
                    className="mt-4" 
                    onClick={handleMarkAsComplete}
                    disabled={isCompleted}
                  >
                    {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu là đã hoàn thành'}
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
