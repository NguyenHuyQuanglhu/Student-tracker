"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { courseData, mockDataVersion } from "@/app/lib/mock-data";
import { useState, useEffect } from "react";

const chartConfig = {
  value: {
    label: "Progress",
    color: "hsl(var(--primary))",
  },
};

export function SoftSkillsDashboard() {
  const [skills, setSkills] = useState<any[]>([]);

  const updateSkillStates = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('mockDataVersion') !== mockDataVersion) {
            localStorage.removeItem('courseProgress');
            localStorage.setItem('mockDataVersion', mockDataVersion);
        }
        
        const progressState = JSON.parse(localStorage.getItem('courseProgress') || '{}');
        
        const skillCourses = courseData
            .filter(course => course.category === 'Kỹ năng')
            .map(course => {
                const state = progressState[course.id];
                const progress = state ? state.progress : course.progress;
                return { skill: course.name, value: progress };
            });

        setSkills(skillCourses);
    }
  };

  useEffect(() => {
    updateSkillStates();

    window.addEventListener('courseStateChanged', updateSkillStates);

    return () => {
      window.removeEventListener('courseStateChanged', updateSkillStates);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Phát triển kỹ năng mềm</CardTitle>
        <CardDescription>Đánh giá các kỹ năng mềm cốt lõi của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart accessibilityLayer data={skills} layout="vertical" margin={{left: 20, right: 20}}>
                    <CartesianGrid horizontal={false} />
                    <YAxis dataKey="skill" type="category" tickLine={false} axisLine={false} tickMargin={10} width={100} />
                    <XAxis dataKey="value" type="number" hide domain={[0, 100]}/>
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted))'}} 
                      contentStyle={{backgroundColor: 'hsl(var(--background))'}}
                      formatter={(value: number) => [`${value}%`, 'Progress']}
                    />
                    <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
