'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { courseData } from "@/app/lib/mock-data";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  
  const [course, setCourse] = useState(() => courseData.find(c => c.id === courseId));
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState(course?.status);

  const updateCourseState = () => {
    if (typeof window === 'undefined' || !courseId) return;

    const targetCourse = courseData.find(c => c.id === courseId);
    if (!targetCourse) {
      notFound();
      return;
    }

    const completedInSession = sessionStorage.getItem('completedCourses');
    const completedCourses = completedInSession ? JSON.parse(completedInSession) : [];
    const hasCompleted = completedCourses.includes(courseId);

    const activeInSession = sessionStorage.getItem('activeCourses');
    const activeCourses = activeInSession ? JSON.parse(activeInSession) : [];
    const isActive = activeCourses.includes(courseId);

    const newProgress = hasCompleted ? 100 : (isActive && targetCourse.progress === 0 ? 10 : targetCourse.progress);
    const newStatus = hasCompleted ? 'Finished' : (isActive ? 'Active' : targetCourse.status);

    setCourse({ ...targetCourse, progress: newProgress, status: newStatus });
    setIsCompleted(hasCompleted);
    setStatus(newStatus);
  };

  useEffect(() => {
    updateCourseState();
    
    window.addEventListener('courseStateChanged', updateCourseState);
    
    return () => {
        window.removeEventListener('courseStateChanged', updateCourseState);
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
        
        // Remove from active if it exists there
        let activeCourses = JSON.parse(sessionStorage.getItem('activeCourses') || '[]');
        const index = activeCourses.indexOf(courseId);
        if (index > -1) {
            activeCourses.splice(index, 1);
            sessionStorage.setItem('activeCourses', JSON.stringify(activeCourses));
        }

        window.dispatchEvent(new CustomEvent('courseStateChanged'));
    }
  };

  const handleStartCourse = () => {
    if (course.status !== 'Active') {
        let activeCourses = JSON.parse(sessionStorage.getItem('activeCourses') || '[]');
        if (!activeCourses.includes(courseId)) {
            activeCourses.push(courseId);
            sessionStorage.setItem('activeCourses', JSON.stringify(activeCourses));
        }
        window.dispatchEvent(new CustomEvent('courseStateChanged'));
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
                    <Button onClick={handleStartCourse} disabled={status === 'Active' || isCompleted}>
                      {status === 'Active' ? 'Đang học' : 'Bắt đầu học'}
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
