
'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { courseData, mockDataVersion } from "@/app/lib/mock-data";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Pause } from "lucide-react";
import { Progress } from '@/components/ui/progress';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = typeof params.courseId === 'string' ? params.courseId : '';
  
  const [course, setCourse] = useState(() => courseData.find(c => c.id === courseId) || null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'Active' | 'Finished' | 'Paused'>('Paused');
  const [isLearning, setIsLearning] = useState(false);

  const initialLoadDone = useRef(false);

  // 1. Load state from localStorage on initial component mount
  useEffect(() => {
    if (typeof window === 'undefined' || !courseId) return;
    if (initialLoadDone.current) return;

    if (localStorage.getItem('mockDataVersion') !== mockDataVersion) {
      localStorage.clear();
      localStorage.setItem('mockDataVersion', mockDataVersion);
    }
    
    const targetCourse = courseData.find(c => c.id === courseId);
    if (!targetCourse) {
      notFound();
      return;
    }

    const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const courseState = progressState[courseId];
    
    setCourse({ ...targetCourse });
    if (courseState) {
        setProgress(courseState.progress || 0);
        setStatus(courseState.status || 'Paused');
        setIsLearning(false); // Always start in a non-learning state
    } else {
        setProgress(targetCourse.progress);
        setStatus(targetCourse.status);
    }
    
    initialLoadDone.current = true;

  }, [courseId]);

  // 2. Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined' || !courseId || !course || !initialLoadDone.current) {
        return;
    }
    
    const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    progressState[courseId] = { progress: progress, status: status };
    localStorage.setItem('courseProgress', JSON.stringify(progressState));

    // If it's a skill course and progress is 100, update skillMastery
    if (course.category === 'Kỹ năng' && progress === 100) {
        const skillMastery = JSON.parse(localStorage.getItem('skillMastery') || '{}');
        const currentMastery = skillMastery[courseId] || 0;
        if (progress > currentMastery) {
            skillMastery[courseId] = progress;
            localStorage.setItem('skillMastery', JSON.stringify(skillMastery));
            // Notify skill chart to update
            window.dispatchEvent(new CustomEvent('skillMasteryChanged'));
        }
    }


    window.dispatchEvent(new CustomEvent('courseStateChanged'));

  }, [progress, status, courseId, course]);

  // 3. Handle learning progress simulation (the timer)
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


  if (!course) {
    return null;
  }

  const handleStartCourse = () => {
    if (isLearning) return;
  
    let startProgress = progress;
  
    // If it's a finished course (Môn học OR Kỹ năng), restart it from 0.
    if (status === 'Finished') {
      startProgress = 0;
    // Rule: If it's a new course, start from 1.
    } else if (progress === 0) {
      startProgress = 1;
    }
    // Otherwise, continue from the current progress.
  
    setProgress(startProgress);
    setStatus('Active');
    setIsLearning(true);
  };
  
  const handlePauseCourse = () => {
    setIsLearning(false);
    setStatus('Paused');
  };

  const handleMarkAsComplete = () => {
    setIsLearning(false);
    setProgress(100);
    setStatus('Finished');
  };

  const getButtonText = () => {
    if (status === 'Finished') {
      return 'Học lại';
    }
    if (progress > 0 && !isLearning) {
      return 'Tiếp tục học';
    }
    if (isLearning) {
      return 'Đang học...';
    }
    return 'Bắt đầu học';
  };

  const isCompleted = status === 'Finished';
  const isSkillCourse = course.category === 'Kỹ năng';

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
                    
                    {isLearning ? (
                       <Button onClick={handlePauseCourse} variant="secondary">
                         <Pause className="mr-2 h-4 w-4" />
                         Tạm dừng
                       </Button>
                    ) : (
                       <Button onClick={handleStartCourse}>
                         {getButtonText()}
                       </Button>
                    )}
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
