"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { courseData, mockDataVersion } from "@/app/lib/mock-data";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

const statusColors = {
  inProgress: 'hsl(var(--primary))',
  completed: 'hsl(var(--chart-2))',
  notStarted: 'hsl(var(--muted))',
};

const StatusLegend = () => (
    <div className="flex justify-center gap-4 text-xs mt-4">
        <div className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: statusColors.inProgress}}></span>
            Đang học
        </div>
        <div className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: statusColors.completed}}></span>
            Hoàn thành
        </div>
        <div className="flex items-center">
            <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: statusColors.notStarted}}></span>
            Chưa bắt đầu
        </div>
    </div>
)

export function ProgressOverview() {
  const [internalCourseData, setInternalCourseData] = useState(courseData);

  const updateStats = () => {
      if (typeof window !== 'undefined') {
          // Clear session storage if version mismatch
          if (sessionStorage.getItem('mockDataVersion') !== mockDataVersion) {
              sessionStorage.removeItem('completedCourses');
              sessionStorage.removeItem('activeCourses');
              sessionStorage.setItem('mockDataVersion', mockDataVersion);
          }

          const completedCoursesSession = JSON.parse(sessionStorage.getItem('completedCourses') || '[]');
          const activeCoursesSession = JSON.parse(sessionStorage.getItem('activeCourses') || '[]');

          const updatedCourses = courseData.map(course => {
              if (completedCoursesSession.includes(course.id)) {
                  return { ...course, progress: 100, status: 'Finished' as const };
              }
              if (activeCoursesSession.includes(course.id)) {
                  const newProgress = course.progress === 0 ? 10 : course.progress;
                  return { ...course, status: 'Active' as const, progress: newProgress };
              }
              return { ...course };
          });
          setInternalCourseData(updatedCourses);
      }
  }

  useEffect(() => {
    updateStats();

    window.addEventListener('courseStateChanged', updateStats);

    return () => {
        window.removeEventListener('courseStateChanged', updateStats);
    };
  }, []);
  
  const activeCourses = internalCourseData.filter(c => c.progress < 100);

  const subjects = activeCourses.filter(c => c.category === 'Môn học');
  const skills = activeCourses.filter(c => c.category === 'Kỹ năng');

  const totalSubjects = subjects.length;
  const inProgressSubjects = subjects.filter(c => c.status === 'Active' && c.progress < 100).length;
  const notStartedSubjects = totalSubjects - inProgressSubjects;
  
  const subjectStatusData = [
    { name: 'Đang học', value: inProgressSubjects, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: 0, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSubjects, fill: statusColors.notStarted },
  ];

  const totalSkills = skills.length;
  const inProgressSkills = skills.filter(c => c.status === 'Active' && c.progress < 100).length;
  const notStartedSkills = totalSkills - inProgressSkills;

  const skillStatusData = [
    { name: 'Đang học', value: inProgressSkills, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: 0, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSkills, fill: statusColors.notStarted },
  ];

  const totalCourses = activeCourses.length;
  const inProgressCourses = activeCourses.filter(c => c.status === 'Active' && c.progress < 100).length;
  const notStartedCourses = totalCourses - inProgressCourses;

  const allCoursesStatusData = [
    { name: 'Đang học', value: inProgressCourses, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: 0, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedCourses, fill: statusColors.notStarted },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Hiệu suất &amp; Thống kê</CardTitle>
        <CardDescription>Tổng quan về tiến độ học tập của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
            <h3 className="text-lg font-semibold">Tổng khóa học</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{totalCourses}</span>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[150px] w-full mt-4 mx-auto">
                <PieChart accessibilityLayer >
                    <Pie data={allCoursesStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} >
                         {allCoursesStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
        <div>
            <h3 className="text-lg font-semibold">Tổng số môn học</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{totalSubjects}</span>
            </div>
            <ChartContainer config={{}} className="min-h-[150px] w-full mt-4 mx-auto">
                <PieChart accessibilityLayer >
                    <Pie data={subjectStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} >
                         {subjectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
        <div>
            <h3 className="text-lg font-semibold">Tổng số kỹ năng</h3>
             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{totalSkills}</span>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[150px] w-full mt-4 mx-auto">
                <PieChart accessibilityLayer >
                    <Pie data={skillStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} >
                         {skillStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
      </CardContent>
      <CardFooter>
          <div className="w-full">
            <StatusLegend />
          </div>
      </CardFooter>
    </Card>
  );
}
