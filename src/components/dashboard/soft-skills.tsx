"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { softSkills } from "@/app/lib/mock-data";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
};

export function SoftSkillsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Phát triển kỹ năng mềm</CardTitle>
        <CardDescription>Đánh giá các kỹ năng mềm cốt lõi của bạn.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={softSkills} layout="vertical" margin={{left: 10}}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="skill" type="category" tickLine={false} axisLine={false} tickMargin={10} width={110} />
                <XAxis dataKey="value" type="number" hide />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
