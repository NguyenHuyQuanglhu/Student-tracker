"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";

const workingHoursData = [
  { name: 'Progress', value: 77, fill: 'hsl(var(--primary))' },
  { name: 'Done', value: 23, fill: 'hsl(var(--muted))' },
];

export function SoftSkillsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Giờ làm việc</CardTitle>
        <CardDescription>Tiến độ của bạn trong tuần này.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-[180px]">
          <PieChart>
            <Pie
              data={workingHoursData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
            >
              {workingHoursData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
              ))}
            </Pie>
             <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-4xl font-bold fill-foreground"
            >
              77%
            </text>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
