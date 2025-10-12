"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exercises as mockExercises, mockDataVersion } from "@/app/lib/mock-data";
import { ChartContainer } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const chartConfig = {
    completionTime: {
        label: "Thời gian làm bài (phút)",
        color: "hsl(var(--chart-1))",
    },
    targetTime: {
        label: "Thời gian mục tiêu (phút)",
        color: "hsl(var(--chart-2))",
    },
};

type ChartData = {
    title: string;
    completionTime: number;
    targetTime: number;
    score: number | null;
}

export function ExercisePerformanceChart() {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const updateChartData = () => {
        if (typeof window === 'undefined') return;

        if (sessionStorage.getItem('mockDataVersion') !== mockDataVersion) {
            sessionStorage.removeItem('exerciseState');
            sessionStorage.setItem('mockDataVersion', mockDataVersion);
        }
        
        const storedState = JSON.parse(sessionStorage.getItem('exerciseState') || '{}');

        const completedExercises = Object.keys(storedState)
            .map(exerciseId => {
                const state = storedState[exerciseId];
                const originalExercise = mockExercises.find(ex => ex.id === exerciseId);

                if (originalExercise && state.status === 'Đã hoàn thành' && state.completionTime !== null && state.score !== null) {
                    return { 
                        title: originalExercise.title, // Keep full title for table
                        completionTime: parseFloat((state.completionTime / 60).toFixed(2)),
                        targetTime: parseFloat((originalExercise.targetTime / 60).toFixed(2)),
                        score: state.score,
                    };
                }
                return null;
            })
            .filter((ex): ex is ChartData => ex !== null);
        
        setChartData(completedExercises);
    };

    useEffect(() => {
        updateChartData();
        window.addEventListener('exerciseStateChanged', updateChartData);
        return () => {
            window.removeEventListener('exerciseStateChanged', updateChartData);
        };
    }, []);
    
    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-60">
                <p className="text-muted-foreground">Chưa có bài tập nào được hoàn thành để hiển thị thống kê.</p>
            </div>
        )
    }

    const chartDisplayData = chartData.map(d => ({ ...d, shortTitle: d.title.split(' ').slice(0, 3).join(' ') + '...' }));

    return (
        <div className="space-y-6">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartDisplayData} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="shortTitle" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis label={{ value: 'Phút', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            cursor={{ fill: 'hsl(var(--muted))' }}
                        />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                        <Bar dataKey="completionTime" fill="var(--color-completionTime)" name="Thời gian làm bài (phút)" />
                        <Bar dataKey="targetTime" fill="var(--color-targetTime)" name="Thời gian mục tiêu (phút)" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            
            <div>
                <h4 className="text-md font-semibold mb-2">Chi tiết hiệu suất</h4>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bài tập</TableHead>
                                <TableHead className="text-right">Thời gian làm (phút)</TableHead>
                                <TableHead className="text-right">Thời gian mục tiêu (phút)</TableHead>
                                <TableHead className="text-right">Điểm (/100)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chartData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="text-right">{item.completionTime.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.targetTime.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
