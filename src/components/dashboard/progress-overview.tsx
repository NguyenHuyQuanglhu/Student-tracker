"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { courseData, mockDataVersion } from "@/app/lib/mock-data";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExercisePerformanceChart } from "./exercise-performance-chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

const formatHoursToHHMMSS = (decimalHours: number): string => {
    const totalSeconds = Math.floor(decimalHours * 3600);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
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

type CoursePerformanceData = {
    name: string;
    progress: number;
    estimatedHours: number;
}

function CoursePerformanceDetails({ courses }: { courses: (typeof courseData) }) {
    const performanceData: CoursePerformanceData[] = courses
        .filter(course => course.progress > 0)
        .map(course => ({
            name: course.name,
            progress: course.progress,
            estimatedHours: parseFloat(((course.targetHours * course.progress) / 100).toFixed(2)),
        }));

    if (performanceData.length === 0) {
        return (
            <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">Chưa có khóa học nào được bắt đầu để hiển thị chi tiết.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-6">
            <h4 className="text-md font-semibold">Chi tiết hiệu suất khóa học</h4>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Khóa học</TableHead>
                            <TableHead className="text-right">Phần trăm hoàn thành (%)</TableHead>
                            <TableHead className="text-right">Thời gian học ước tính (giờ)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {performanceData.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">{item.progress}</TableCell>
                                <TableCell className="text-right">{formatHoursToHHMMSS(item.estimatedHours)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export function ProgressOverview() {
  const [internalCourseData, setInternalCourseData] = useState(courseData);

  const updateStats = () => {
      if (typeof window !== 'undefined') {
          if (sessionStorage.getItem('mockDataVersion') !== mockDataVersion) {
              sessionStorage.removeItem('courseProgress');
              sessionStorage.setItem('mockDataVersion', mockDataVersion);
          }

          const progressState = JSON.parse(sessionStorage.getItem('courseProgress') || '{}');

          const updatedCourses = courseData.map(course => {
              const state = progressState[course.id];
              if (state) {
                  return { ...course, progress: state.progress, status: state.status };
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
  
  const subjects = internalCourseData.filter(c => c.category === 'Môn học');
  const skills = internalCourseData.filter(c => c.category === 'Kỹ năng');

  const totalSubjects = subjects.length;
  const inProgressSubjects = subjects.filter(c => c.status === 'Active').length;
  const completedSubjects = subjects.filter(c => c.status === 'Finished').length;
  const notStartedSubjects = totalSubjects - inProgressSubjects - completedSubjects;
  
  const subjectStatusData = [
    { name: 'Đang học', value: inProgressSubjects, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedSubjects, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSubjects, fill: statusColors.notStarted },
  ];

  const totalSkills = skills.length;
  const inProgressSkills = skills.filter(c => c.status === 'Active').length;
  const completedSkills = skills.filter(c => c.status === 'Finished').length;
  const notStartedSkills = totalSkills - inProgressSkills - completedSkills;

  const skillStatusData = [
    { name: 'Đang học', value: inProgressSkills, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedSkills, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSkills, fill: statusColors.notStarted },
  ];

  const totalCourses = internalCourseData.length;
  const inProgressCourses = internalCourseData.filter(c => c.status === 'Active').length;
  const completedCourses = internalCourseData.filter(c => c.status === 'Finished').length;
  const notStartedCourses = totalCourses - inProgressCourses - completedCourses;

  const allCoursesStatusData = [
    { name: 'Đang học', value: inProgressCourses, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedCourses, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedCourses, fill: statusColors.notStarted },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Hiệu suất &amp; Thống kê</CardTitle>
        <CardDescription>Tổng quan về tiến độ học tập và hiệu suất bài tập của bạn.</CardDescription>
      </CardHeader>
      <Tabs defaultValue="courses">
        <div className="px-6">
            <TabsList>
                <TabsTrigger value="courses">Thống kê khóa học</TabsTrigger>
                <TabsTrigger value="exercises">Thống kê bài tập</TabsTrigger>
            </TabsList>
        </div>
        <TabsContent value="courses">
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
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
                </div>
                <div className="w-full mt-4">
                    <StatusLegend />
                </div>
                <CoursePerformanceDetails courses={internalCourseData} />
            </CardContent>
        </TabsContent>
        <TabsContent value="exercises">
            <CardContent>
                <ExercisePerformanceChart />
            </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
