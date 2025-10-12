"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exercises } from "@/app/lib/mock-data";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
    completionTime: {
        label: "Thời gian làm bài (phút)",
        color: "hsl(var(--chart-1))",
    },
    targetTime: {
        label: "Thời gian mục tiêu (phút)",
        color: "hsl(var(--chart-2))",
    },
    score: {
        label: "Điểm",
        color: "hsl(var(--chart-3))",
    }
};

export function ExercisePerformanceChart() {
    const completedExercises = exercises
        .filter(ex => ex.status === 'Đã hoàn thành' && ex.completionTime !== null)
        .map(ex => ({
            ...ex,
            title: ex.title.split(' ').slice(0, 3).join(' ') + '...', // Shorten title
            completionTime: parseFloat((ex.completionTime! / 60).toFixed(2)), // to minutes
            targetTime: parseFloat((ex.targetTime / 60).toFixed(2)), // to minutes
        }));
    
    if (completedExercises.length === 0) {
        return (
            <div className="flex items-center justify-center h-60">
                <p className="text-muted-foreground">Chưa có bài tập nào được hoàn thành để hiển thị thống kê.</p>
            </div>
        )
    }

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completedExercises} margin={{ top: 5, right: 20, left: 20, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="title" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke={chartConfig.completionTime.color} />
                    <YAxis yAxisId="right" orientation="right" stroke={chartConfig.score.color} domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                        cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                    <Bar yAxisId="left" dataKey="completionTime" fill="var(--color-completionTime)" name="Thời gian làm bài (phút)" />
                    <Bar yAxisId="left" dataKey="targetTime" fill="var(--color-targetTime)" name="Thời gian mục tiêu (phút)" />
                    <Bar yAxisId="right" dataKey="score" fill="var(--color-score)" name="Điểm" />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
}
