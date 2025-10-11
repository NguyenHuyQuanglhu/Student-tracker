"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { progressOverview } from "@/app/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const courseStatusData = [
    { name: 'In Progress', value: 12, fill: 'hsl(var(--primary))' },
    { name: 'Completed', value: 5, fill: 'hsl(var(--chart-2))' },
    { name: 'Yet to Start', value: 2, fill: 'hsl(var(--muted))' },
];

export function ProgressOverview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Hiệu suất & Thống kê</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <h3 className="text-lg font-semibold">Tổng số khóa học</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">19</span>
                <span className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" /> 2 Mới
                </span>
            </div>
            <ChartContainer config={{}} className="min-h-[150px] w-full mt-4">
                <PieChart accessibilityLayer >
                    <Pie data={courseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} >
                         {courseStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ChartContainer>
            <div className="flex justify-center gap-4 text-xs mt-2">
                {courseStatusData.map((item) => (
                    <div key={item.name} className="flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: item.fill}}></span>
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold">Thời gian đã học</h3>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">21h 30m</span>
                <span className="flex items-center text-red-500">
                    <TrendingDown className="w-4 h-4 mr-1" /> 15%
                </span>
            </div>
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-4">
                <BarChart accessibilityLayer data={progressOverview.courses.slice(0, 7)} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                />
                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
