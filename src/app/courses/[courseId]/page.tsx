'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { courseData, mockDataVersion } from "@/app/lib/mock-data";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Progress } from '@/components/ui/progress';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  
  const [course, setCourse] = useState(() => courseData.find(c => c.id === courseId));
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(course?.status);
  const isLearning = useRef(false);
  const progressRef = useRef(progress);
  
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Function to load state from sessionStorage
  const loadCourseState = () => {
    if (typeof window === 'undefined' || !courseId) return;

    if (sessionStorage.getItem('mockDataVersion') !== mockDataVersion) {
      sessionStorage.removeItem('courseProgress');
      sessionStorage.setItem('mockDataVersion', mockDataVersion);
    }
    
    const targetCourse = courseData.find(c => c.id === courseId);
    if (!targetCourse) {
      notFound();
      return;
    }

    const progressState = JSON.parse(sessionStorage.getItem('courseProgress') || '{}');
    const courseState = progressState[courseId] || { progress: targetCourse.progress, status: targetCourse.status };
    
    setCourse({ ...targetCourse });
    setProgress(courseState.progress);
    setStatus(courseState.status);
    isLearning.current = courseState.status === 'Active';
  };

  // Function to save state to sessionStorage
  const saveCourseState = (newProgress: number, newStatus: string) => {
      if (typeof window === 'undefined' || !courseId) return;
      const progressState = JSON.parse(sessionStorage.getItem('courseProgress') || '{}');
      progressState[courseId] = { progress: newProgress, status: newStatus };
      sessionStorage.setItem('courseProgress', JSON.stringify(progressState));
      window.dispatchEvent(new CustomEvent('courseStateChanged'));
  };

  // Load state on initial render and on courseId change
  useEffect(() => {
    loadCourseState();
    
    // Listen for external state changes
    const handleStateChange = () => loadCourseState();
    window.addEventListener('courseStateChanged', handleStateChange);
    
    return () => {
        window.removeEventListener('courseStateChanged', handleStateChange);
    };
  }, [courseId]);

  // Effect for dynamic progress increase
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (status === 'Active' && progress < 100) {
      isLearning.current = true;
      timer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = Math.min(prevProgress + 1, 100);
          if (newProgress === 100) {
            isLearning.current = false;
            setStatus('Finished');
            saveCourseState(100, 'Finished');
            if (timer) clearInterval(timer);
          }
          return newProgress;
        });
      }, 2000); // Increase progress every 2 seconds
    } else {
        isLearning.current = false;
    }
    
    // Cleanup function: This will run when the component unmounts or status changes
    return () => {
      if (timer) clearInterval(timer);
      if (isLearning.current) {
        saveCourseState(progressRef.current, 'Active');
      }
    };
  }, [status, courseId]); // Only re-run when status or courseId changes


  if (!course) {
    return null;
  }

  const handleMarkAsComplete = () => {
    isLearning.current = false;
    setProgress(100);
    setStatus('Finished');
    saveCourseState(100, 'Finished');
  };

  const handleStartCourse = () => {
    if (status !== 'Active') {
        const newProgress = progress === 100 ? 0 : progress === 0 ? 1 : progress;
        setProgress(newProgress);
        setStatus('Active');
        saveCourseState(newProgress, 'Active');
    }
  };

  const isCompleted = status === 'Finished';

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
                <CardDescription>Tiến độ hiện tại của bạn: {progress}%</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-8" />
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
                    <Button onClick={handleStartCourse} disabled={status === 'Active' && !isCompleted}>
                      {isCompleted ? 'Học lại' : status === 'Active' ? 'Đang học' : 'Bắt đầu học'}
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
