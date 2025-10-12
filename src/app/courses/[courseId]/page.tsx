'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { courseData } from "@/app/lib/mock-data";
import { notFound, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  
  const [course, setCourse] = useState(() => courseData.find(c => c.id === courseId));
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const targetCourse = courseData.find(c => c.id === courseId);
    if (!targetCourse) {
      notFound();
      return;
    }

    const completedInSession = sessionStorage.getItem('completedCourses');
    const completedCourses = completedInSession ? JSON.parse(completedInSession) : [];
    const hasCompleted = completedCourses.includes(courseId);

    setCourse(hasCompleted ? { ...targetCourse, progress: 100 } : { ...targetCourse });
    setIsCompleted(hasCompleted);

    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.includes(courseId)) {
            setCourse({ ...targetCourse, progress: 100 });
            setIsCompleted(true);
        }
    };
    
    window.addEventListener('courseCompleted', handleStorageChange);
    
    return () => {
        window.removeEventListener('courseCompleted', handleStorageChange);
    };
  }, [courseId]);


  if (!course) {
    return null;
  }

  const handleMarkAsComplete = () => {
    if (!isCompleted) {
        let completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '[]');
        if (!completedCourses.includes(courseId)) {
            completedCourses.push(courseId);
            sessionStorage.setItem('completedCourses', JSON.stringify(completedCourses));
        }
        
        window.dispatchEvent(new CustomEvent('courseCompleted', { detail: completedCourses }));
        
        setCourse({ ...course, progress: 100 });
        setIsCompleted(true);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
            <div className="mb-6">
                 <Link href="/" passHref>
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
                <CardDescription>Tiến độ hiện tại của bạn: {course.progress}%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">Nội dung sắp ra mắt!</h3>
                  <p className="text-muted-foreground">Các bài học và tài liệu cho khóa học này đang được xây dựng.</p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Button 
                      onClick={handleMarkAsComplete}
                      disabled={isCompleted}
                    >
                      {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu là đã hoàn thành'}
                    </Button>
                    <Button
                      disabled
                    >
                      Hoàn thành
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}
