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
  const [isLearning, setIsLearning] = useState(false);
  
  // Refs to hold the latest state values for the cleanup function
  const progressRef = useRef(progress);
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const statusRef = useRef(status);
   useEffect(() => {
    statusRef.current = status;
  }, [status]);
  
  // Load state from localStorage only once on component mount for the specific course
  useEffect(() => {
    if (typeof window === 'undefined' || !courseId) return;

    if (localStorage.getItem('mockDataVersion') !== mockDataVersion) {
      localStorage.removeItem('courseProgress');
      localStorage.setItem('mockDataVersion', mockDataVersion);
    }
    
    const targetCourse = courseData.find(c => c.id === courseId);
    if (!targetCourse) {
      notFound();
      return;
    }

    const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const courseState = progressState[courseId] || { progress: targetCourse.progress, status: targetCourse.status, isLearning: false };
    
    setCourse({ ...targetCourse });
    setProgress(courseState.progress);
    setStatus(courseState.status);
    setIsLearning(courseState.isLearning);
  }, [courseId]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
      if (typeof window === 'undefined' || !courseId || !course) return;
      const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      progressState[courseId] = { progress: progress, status: status, isLearning: isLearning };
      localStorage.setItem('courseProgress', JSON.stringify(progressState));
      window.dispatchEvent(new CustomEvent('courseStateChanged'));
  }, [progress, status, isLearning, courseId, course]);

  // Handle learning progress simulation
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isLearning && progress < 100) {
      timer = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = Math.min(prevProgress + 1, 100);
          if (newProgress === 100) {
            setIsLearning(false);
            setStatus('Finished');
            if (timer) clearInterval(timer);
          }
          return newProgress;
        });
      }, 2000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLearning, progress]);

  // Final save on unmount/navigation
  useEffect(() => {
    return () => {
        if (typeof window !== 'undefined' && courseId) {
            const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
            // Save the latest values from refs, and always set isLearning to false when leaving the page
            progressState[courseId] = { progress: progressRef.current, status: statusRef.current, isLearning: false }; 
            localStorage.setItem('courseProgress', JSON.stringify(progressState));
            window.dispatchEvent(new CustomEvent('courseStateChanged'));
        }
    };
  }, [courseId]);


  if (!course) {
    return null;
  }

  const handleMarkAsComplete = () => {
    setIsLearning(false);
    setProgress(100);
    setStatus('Finished');
  };

  const handleStartCourse = () => {
    if (status === 'Finished') { 
        setProgress(1);
    } else if (progress === 0) {
        setProgress(1);
    }
    
    setStatus('Active');
    setIsLearning(true);
  };


  const getButtonText = () => {
    if (status === 'Finished') {
      return 'Học lại';
    }
    if (isLearning) {
      return 'Đang học...';
    }
    if (progress > 0) {
      return 'Tiếp tục học';
    }
    return 'Bắt đầu học';
  };

  const isCompleted = status === 'Finished';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4">
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
                    {!isCompleted && (
                       <Button 
                         onClick={handleMarkAsComplete}
                       >
                         Đánh dấu là đã hoàn thành
                       </Button>
                    )}
                    <Button onClick={handleStartCourse} disabled={isLearning}>
                      {getButtonText()}
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
