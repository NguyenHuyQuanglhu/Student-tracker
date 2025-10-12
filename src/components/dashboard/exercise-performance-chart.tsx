"use client"

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exercises as mockExercises, mockDataVersion, Exercise } from "@/app/lib/mock-data";
import { ChartContainer } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

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

const gradeColors: Record<Grade, string> = {
    S: 'bg-purple-100 text-purple-800',
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-orange-100 text-orange-800',
    E: 'bg-red-100 text-red-800',
    F: 'bg-red-200 text-red-900',
};


const calculateGrade = (score: number, completionTime: number, targetTime: number, difficulty: Exercise['difficulty']): Grade => {
    let grade: Grade;
    const grades: Grade[] = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

    // Base grade on score
    if (score >= 95) grade = 'S';
    else if (score >= 85) grade = 'A';
    else if (score >= 75) grade = 'B';
    else if (score >= 65) grade = 'C';
    else if (score >= 55) grade = 'D';
    else if (score >= 45) grade = 'E';
    else grade = 'F';

    // Adjust based on time and difficulty
    const timeRatio = completionTime / targetTime;
    let currentGradeIndex = grades.indexOf(grade);

    switch (difficulty) {
        case 'Dễ':
            if (timeRatio <= 0.7) currentGradeIndex++; // Significant bonus for being fast
            else if (timeRatio > 1.3) currentGradeIndex--; // Penalty for being slow
            break;
        case 'Trung bình':
            if (timeRatio <= 0.8) currentGradeIndex++; // Standard bonus
            else if (timeRatio > 1.2) currentGradeIndex--; // Standard penalty
            break;
        case 'Khó':
            if (timeRatio <= 0.9) currentGradeIndex++; // Small bonus, score is more important
            else if (timeRatio > 1.5) currentGradeIndex--; // Lenient penalty
            break;
    }

    // Ensure grade stays within bounds
    if (currentGradeIndex < 0) currentGradeIndex = 0;
    if (currentGradeIndex >= grades.length) currentGradeIndex = grades.length - 1;
    
    return grades[currentGradeIndex];
};


type ChartData = {
    title: string;
    completionTime: number;
    targetTime: number;
    score: number | null;
    grade: Grade;
    difficulty: Exercise['difficulty'];
}

const ExerciseSummary = ({ data }: { data: ChartData[] }) => {
    if (data.length === 0) {
        return null;
    }

    const totalExercises = data.length;
    const avgScore = data.reduce((acc, item) => acc + (item.score || 0), 0) / totalExercises;
    const avgCompletionTime = data.reduce((acc, item) => acc + item.completionTime, 0) / totalExercises;
    const avgTargetTime = data.reduce((acc, item) => acc + item.targetTime, 0) / totalExercises;

    const getEvaluation = () => {
        let scoreFeedback: React.ReactNode;
        if (avgScore >= 90) {
            scoreFeedback = "Xuất sắc! Điểm trung bình của bạn rất cao.";
        } else if (avgScore >= 75) {
            scoreFeedback = "Làm tốt lắm! Bạn đang nắm vững kiến thức.";
        } else if (avgScore >= 60) {
            scoreFeedback = "Khá tốt! Hãy tiếp tục cố gắng để cải thiện hơn nữa.";
        } else {
            const lowScoreExercises = data
                .filter(item => item.score !== null)
                .sort((a, b) => (a.score!) - (b.score!))
                .slice(0, 2);

            scoreFeedback = (
                <div>
                    <p className="font-semibold">Cần cố gắng hơn. Dưới đây là các phần bạn nên xem lại:</p>
                    <ul className="list-disc pl-5 mt-1">
                        {lowScoreExercises.map((ex, i) => (
                            <li key={i}>{ex.title} (Điểm: {ex.score})</li>
                        ))}
                    </ul>
                </div>
            );
        }

        let timeFeedback = '';
        const timeRatio = avgCompletionTime / avgTargetTime;
        if (timeRatio <= 0.8) {
            timeFeedback = "Tốc độ của bạn rất ấn tượng, nhanh hơn đáng kể so với mục tiêu.";
        } else if (timeRatio <= 1) {
            timeFeedback = "Bạn quản lý thời gian rất tốt.";
        } else if (timeRatio <= 1.2) {
            timeFeedback = "Tốc độ của bạn khá ổn, gần với thời gian mục tiêu.";
        } else {
            timeFeedback = "Có vẻ bạn cần thêm thời gian. Hãy thử luyện tập để tăng tốc độ.";
        }

        return { scoreFeedback, timeFeedback };
    };

    const { scoreFeedback, timeFeedback } = getEvaluation();

    return (
        <div className="mb-6">
             <h3 className="text-lg font-semibold mb-4">Tổng kết hiệu suất</h3>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nhận xét & Đánh giá</CardTitle>
                         <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">{scoreFeedback}</div>
                        <p className="text-xs text-muted-foreground mt-1">{timeFeedback}</p>
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
                    return { 
                        title: originalExercise.title,
                        completionTime: parseFloat((state.completionTime / 60).toFixed(2)),
                        targetTime: parseFloat((originalExercise.targetTime / 60).toFixed(2)),
                        score: state.score,
                        grade: calculateGrade(state.score, state.completionTime, originalExercise.targetTime, originalExercise.difficulty),
                        difficulty: originalExercise.difficulty,
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

    const difficultyColors: Record<Exercise['difficulty'], string> = {
      'Dễ': 'bg-green-100 text-green-800',
      'Trung bình': 'bg-yellow-100 text-yellow-800',
      'Khó': 'bg-red-100 text-red-800',
    };

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
                                <TableHead>Mức độ</TableHead>
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
                                    <TableCell>
                                        <Badge className={`${difficultyColors[item.difficulty]}`}>{item.difficulty}</Badge>
                                    </TableCell>
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
