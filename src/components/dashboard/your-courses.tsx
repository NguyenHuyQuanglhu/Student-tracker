'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courseData, CourseStatus } from "@/app/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const statusColors: Record<CourseStatus, string> = {
    Active: "bg-blue-100 text-blue-800",
    Finished: "bg-gray-100 text-gray-800",
    Paused: "bg-yellow-100 text-yellow-800",
}

const randomProgressValues = [25, 50, 75];


export function YourCourses() {
    const [courses, setCourses] = useState(courseData);

    useEffect(() => {
        const randomizedCourses = courseData.map(course => {
            const randomProgress = randomProgressValues[Math.floor(Math.random() * randomProgressValues.length)];
            return {
                ...course,
                progress: course.progress === 100 ? 100 : randomProgress,
            };
        });
        setCourses(randomizedCourses);

        const handleCourseCompletion = (event: Event) => {
          const customEvent = event as CustomEvent;
          const { courseId } = customEvent.detail;
          setCourses(prevCourses =>
            prevCourses.map(course =>
              course.id === courseId ? { ...course, progress: 100 } : course
            )
          );
        };
    
        window.addEventListener('courseCompleted', handleCourseCompletion);
    
        return () => {
          window.removeEventListener('courseCompleted', handleCourseCompletion);
        };
      }, []);
      
    const activeCourses = courses.filter(c => c.progress < 100);

  return (
    <div>
        <h3 className="text-xl font-bold mb-4">Các khóa học của bạn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeCourses.map((course) => {
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
    </div>
  )
}
