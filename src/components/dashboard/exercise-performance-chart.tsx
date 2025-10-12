"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exercises as mockExercises, mockDataVersion } from "@/app/lib/mock-data";
import { ChartContainer } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type Grade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

const gradeOrder: Grade[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];

const gradeColors: Record<Grade, string> = {
    S: 'bg-purple-100 text-purple-800',
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
    F: 'bg-red-200 text-red-900',
};


const calculateGrade = (score: number, completionTime: number, targetTime: number): Grade => {
    let grade: Grade;

    // Base grade on score
    if (score >= 95) grade = 'S';
    else if (score >= 85) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 65) grade = 'C';
    else if (score >= 55) grade = 'D';
    else if (score >= 45) grade = 'E';
    else grade = 'F';

    // Adjust based on time
    const timeRatio = completionTime / targetTime;
    const grades: Grade[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
    const currentGradeIndex = grades.indexOf(grade);

    if (timeRatio <= 0.75 && currentGradeIndex < grades.length - 1) {
        // Faster than 75% of target time, upgrade
        grade = grades[currentGradeIndex + 1];
    } else if (timeRatio > 1.25 && currentGradeIndex > 0) {
        // Slower than 125% of target time, downgrade
        grade = grades[currentGradeIndex - 1];
    }
    
    return grade;
};


type ChartData = {
    title: string;
    completionTime: number;
    targetTime: number;
    score: number | null;
    grade: Grade;
}

const ExerciseSummary = ({ data }: { data: ChartData[] }) => {
    if (data.length === 0) {
        return null;
    }

    const totalExercises = data.length;
    const avgScore = data.reduce((acc, item) => acc + (item.score || 0), 0) / totalExercises;
    const avgCompletionTime = data.reduce((acc, item) => acc + item.completionTime, 0) / totalExercises;
    const avgTargetTime = data.reduce((acc, item) => acc + item.targetTime, 0) / totalExercises;

    const gradeCounts = data.reduce((acc, item) => {
        acc[item.grade] = (acc[item.grade] || 0) + 1;
        return acc;
    }, {} as Record<Grade, number>);

    return (
        <div className="mb-6">
             <h3 className="text-lg font-semibold mb-4">Tổng kết hiệu suất</h3>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalExercises}</div>
                        <p className="text-xs text-muted-foreground">tổng số bài tập</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgScore.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">trên thang 100</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{avgCompletionTime.toFixed(2)} phút</div>
                        <p className="text-xs text-muted-foreground">
                            so với mục tiêu {avgTargetTime.toFixed(2)} phút
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Phân loại đánh giá</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2 pt-2">
                        {gradeOrder.map(grade => (
                            gradeCounts[grade] > 0 && (
                                <Badge key={grade} className={`${gradeColors[grade]}`}>
                                    {grade}: {gradeCounts[grade]}
                                </Badge>
                            )
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
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
                    const completionTimeMinutes = parseFloat((state.completionTime / 60).toFixed(2));
                    const targetTimeMinutes = parseFloat((originalExercise.targetTime / 60).toFixed(2));
                    
                    return { 
                        title: originalExercise.title,
                        completionTime: completionTimeMinutes,
                        targetTime: targetTimeMinutes,
                        score: state.score,
                        grade: calculateGrade(state.score, state.completionTime, originalExercise.targetTime),
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
            <ExerciseSummary data={chartData} />

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
                        <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))" label={{ value: 'Phút', angle: -90, position: 'insideLeft' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            cursor={{ fill: 'hsl(var(--muted))' }}
                        />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }}/>
                        <Bar yAxisId="left" dataKey="completionTime" fill="var(--color-completionTime)" name="Thời gian làm bài (phút)" />
                        <Bar yAxisId="left" dataKey="targetTime" fill="var(--color-targetTime)" name="Thời gian mục tiêu (phút)" />
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
                                <TableHead className="text-center">Đánh giá</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {chartData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.title}</TableCell>
                                    <TableCell className="text-right">{item.completionTime.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.targetTime.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{item.score}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={`${gradeColors[item.grade]}`}>{item.grade}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
