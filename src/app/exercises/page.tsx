'use client';

import { useState } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exercises as mockExercises, Exercise } from "@/app/lib/mock-data";

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

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

  const handleStartExercise = (exerciseId: string) => {
    setExercises(exercises.map(ex => 
      ex.id === exerciseId && ex.status === 'Chưa bắt đầu' 
        ? { ...ex, status: 'Đang làm' } 
        : ex
    ));
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
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-headline">{exercise.title}</CardTitle>
                    <Badge className={difficultyColors[exercise.difficulty]}>{exercise.difficulty}</Badge>
                  </div>
                  <CardDescription>Khóa học: {exercise.course}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <Badge className={statusColors[exercise.status]}>{exercise.status}</Badge>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleStartExercise(exercise.id)}
                    disabled={exercise.status !== 'Chưa bắt đầu'}
                  >
                    {exercise.status === 'Chưa bắt đầu' ? 'Bắt đầu' : exercise.status === 'Đang làm' ? 'Tiếp tục' : 'Xem lại'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
      </DashboardSidebar>
    </div>
  );
}