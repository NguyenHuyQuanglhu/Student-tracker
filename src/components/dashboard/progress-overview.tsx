"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { progressOverview } from "@/app/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis } from "recharts";

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ProgressOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Personal Progress</CardTitle>
        <CardDescription>Your academic performance at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Overall Completion</h3>
            <span className="text-sm font-bold" style={{ color: 'hsl(var(--primary))' }}>{progressOverview.overallCompletion}%</span>
          </div>
          <Progress value={progressOverview.overallCompletion} aria-label="Overall course completion" />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-4">Course Scores</h3>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={progressOverview.courses}>
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="score" fill="var(--color-score)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
