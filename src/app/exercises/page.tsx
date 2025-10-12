'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exercises as mockExercises, Exercise } from "@/app/lib/mock-data";
import { Timer, CheckCircle2 } from 'lucide-react';

const difficultyColors: Record<Exercise['difficulty'], string> = {
  'Dễ': 'bg-green-100 text-green-800',
  'Trung bình': 'bg-yellow-100 text-yellow-800',
  'Khó': 'bg-red-100 text-red-800',
};

const statusColors: Record<Exercise['status'], string> = {
  'Đã hoàn thành': 'bg-blue-100 text-blue-800',
  'Đang làm': 'bg-purple-100 text-purple-800',
  'Chưa bắt đầu': 'bg-gray-100 text-gray-800',
};

const formatDuration = (seconds: number) => {
  if (seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const ExerciseTimer = ({ startTime }: { startTime: number }) => {
  const [elapsedTime, setElapsedTime] = useState(Math.floor((Date.now() - startTime) / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex items-center text-sm text-muted-foreground mt-2">
      <Timer className="w-4 h-4 mr-1" />
      <span>{formatDuration(elapsedTime)}</span>
    </div>
  );
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const handleStartExercise = (exerciseId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId && ex.status === 'Chưa bắt đầu' 
        ? { ...ex, status: 'Đang làm', startTime: Date.now() } 
        : ex
    ));
  };

  const handleSubmitExercise = (exerciseId: string) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exerciseId && ex.status === 'Đang làm' && ex.startTime) {
        const completionTime = Math.floor((Date.now() - ex.startTime) / 1000);
        return { ...ex, status: 'Đã hoàn thành', completionTime, score: ex.score ?? Math.floor(Math.random() * 31) + 70 }; // Assign a random score if not present
      }
      return ex;
    }));
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardSidebar>
        <main className="flex-1 p-4 sm:p-8">
          <div className="mb-6">
              <h1 className="text-3xl font-bold font-headline">Bài tập</h1>
              <p className="text-muted-foreground">Xem và quản lý các bài tập của bạn.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <Card key={exercise.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-headline">{exercise.title}</CardTitle>
                    <Badge className={`${difficultyColors[exercise.difficulty]} ml-2`}>{exercise.difficulty}</Badge>
                  </div>
                  <CardDescription>Khóa học: {exercise.course}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                   <Badge className={statusColors[exercise.status]}>{exercise.status}</Badge>
                   {exercise.status === 'Đang làm' && exercise.startTime && (
                     <ExerciseTimer startTime={exercise.startTime} />
                   )}
                   {exercise.status === 'Đã hoàn thành' && exercise.completionTime !== null && (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                          <Timer className="w-4 h-4 mr-1" />
                          <span>Thời gian hoàn thành: {formatDuration(exercise.completionTime)}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          <span>Điểm: {exercise.score}/100</span>
                        </div>
                      </div>
                   )}
                </CardContent>
                <CardFooter>
                  {exercise.status === 'Chưa bắt đầu' && (
                    <Button 
                      className="w-full"
                      onClick={() => handleStartExercise(exercise.id)}
                    >
                      Bắt đầu
                    </Button>
                  )}
                  {exercise.status === 'Đang làm' && (
                    <Button 
                      className="w-full"
                      onClick={() => handleSubmitExercise(exercise.id)}
                    >
                      Nộp bài
                    </Button>
                  )}
                  {exercise.status === 'Đã hoàn thành' && (
                     <Button 
                      className="w-full"
                      disabled
                    >
                      Đã hoàn thành
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}