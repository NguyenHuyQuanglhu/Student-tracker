"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { softSkills } from "@/app/lib/mock-data";
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from "recharts";

const chartConfig = {
  value: {
    label: "Score",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig

export function SoftSkillsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Soft Skills</CardTitle>
        <CardDescription>Your development in key professional areas.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={softSkills}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <PolarGrid />
            <Radar
              name="Soft Skills"
              dataKey="value"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
