"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { courseData, subjectData, skillData } from "@/app/lib/mock-data";
import { PieChart, Pie, Cell } from "recharts";
import { TrendingUp } from "lucide-react";
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

  useEffect(() => {
    const updateStats = () => {
        const completedCourses = JSON.parse(sessionStorage.getItem('completedCourses') || '[]');
        const updatedCourses = courseData.map(course => {
            if (completedCourses.includes(course.id)) {
                return { ...course, progress: 100 };
            }
            return course;
        });
        setInternalCourseData(updatedCourses);
    }
    
    updateStats();

    const handleStorageChange = () => {
        updateStats();
    };

    window.addEventListener('courseCompleted', handleStorageChange);

    return () => {
        window.removeEventListener('courseCompleted', handleStorageChange);
    };
  }, []);

  const totalCourses = internalCourseData.length;
  const completedCourses = internalCourseData.filter(c => c.progress === 100).length;
  const inProgressCourses = internalCourseData.filter(c => c.progress > 0 && c.progress < 100).length;
  const yetToStartCourses = totalCourses - completedCourses - inProgressCourses;

  const courseStatusData = [
    { name: 'Đang học', value: inProgressCourses, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedCourses, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: yetToStartCourses, fill: statusColors.notStarted },
  ];
  
  const totalSubjects = subjectData.length;
  const inProgressSubjects = subjectData.filter(s => s.status === 'inProgress').length;
  const completedSubjects = subjectData.filter(s => s.status === 'completed').length;
  const notStartedSubjects = subjectData.filter(s => s.status === 'notStarted').length;

  const subjectStatusData = [
    { name: 'Đang học', value: inProgressSubjects, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedSubjects, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSubjects, fill: statusColors.notStarted },
  ];

  const totalSkills = skillData.length;
  const inProgressSkills = skillData.filter(s => s.status === 'inProgress').length;
  const completedSkills = skillData.filter(s => s.status === 'completed').length;
  const notStartedSkills = skillData.filter(s => s.status === 'notStarted').length;

  const skillStatusData = [
    { name: 'Đang học', value: inProgressSkills, fill: statusColors.inProgress },
    { name: 'Hoàn thành', value: completedSkills, fill: statusColors.completed },
    { name: 'Chưa bắt đầu', value: notStartedSkills, fill: statusColors.notStarted },
  ];


  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Hiệu suất & Thống kê</CardTitle>
        <CardDescription>Tổng quan về tiến độ học tập của bạn.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
            <h3 className="text-lg font-semibold">Tổng số khóa học</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{totalCourses}</span>
                <span className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" /> 2 Mới
                </span>
            </div>
            <ChartContainer config={{}} className="min-h-[150px] w-full mt-4 mx-auto">
                <PieChart accessibilityLayer >
                    <Pie data={courseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} >
                         {courseStatusData.map((entry, index) => (
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
            <ChartContainer config={chartConfig} className="min-h-[150px] w-full mt-4 mx-auto">
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
