'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exercises as mockExercises, Exercise, mockDataVersion } from "@/app/lib/mock-data";
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

  const updateExerciseStates = () => {
    if (typeof window === 'undefined') return;

    if (sessionStorage.getItem('mockDataVersion') !== mockDataVersion) {
      sessionStorage.removeItem('exerciseState');
      sessionStorage.setItem('mockDataVersion', mockDataVersion);
    }
    
    let storedState = JSON.parse(sessionStorage.getItem('exerciseState') || '{}');
    
    // Clean up storedState: remove exercises that are no longer in mockExercises
    const mockExerciseIds = new Set(mockExercises.map(ex => ex.id));
    Object.keys(storedState).forEach(storedId => {
        if (!mockExerciseIds.has(storedId)) {
            delete storedState[storedId];
        }
    });
    sessionStorage.setItem('exerciseState', JSON.stringify(storedState));


    const updatedExercises = mockExercises.map(ex => {
      const state = storedState[ex.id];
      if (state) {
        return { ...ex, ...state };
      }
      // Reset to default if not in session storage
      const originalExercise = mockExercises.find(mockEx => mockEx.id === ex.id)!;
      return { ...originalExercise };
    });
    setExercises(updatedExercises);
  };

  useEffect(() => {
    updateExerciseStates();
    window.addEventListener('exerciseStateChanged', updateExerciseStates);
    return () => {
      window.removeEventListener('exerciseStateChanged', updateExerciseStates);
    };
  }, []);

  const handleStartExercise = (exerciseId: string) => {
    const storedState = JSON.parse(sessionStorage.getItem('exerciseState') || '{}');
    const exercise = exercises.find(ex => ex.id === exerciseId);

    if (exercise && exercise.status !== 'Đang làm') {
        // If the exercise is completed, reset it first.
        if(exercise.status === 'Đã hoàn thành') {
            delete storedState[exerciseId];
        }

        storedState[exerciseId] = {
            status: 'Đang làm',
            startTime: Date.now(),
            completionTime: null,
            score: null,
        };
        sessionStorage.setItem('exerciseState', JSON.stringify(storedState));
        window.dispatchEvent(new CustomEvent('exerciseStateChanged'));
    }
  };

  const handleSubmitExercise = (exerciseId: string) => {
    const storedState = JSON.parse(sessionStorage.getItem('exerciseState') || '{}');
    const exerciseState = storedState[exerciseId];
    
    if (exerciseState && exerciseState.status === 'Đang làm' && exerciseState.startTime) {
      const completionTime = Math.floor((Date.now() - exerciseState.startTime) / 1000);
      storedState[exerciseId] = {
        ...exerciseState,
        status: 'Đã hoàn thành',
        completionTime: completionTime,
        score: Math.floor(Math.random() * 71) + 30, // Assign random score between 30 and 100
      };
      sessionStorage.setItem('exerciseState', JSON.stringify(storedState));
      window.dispatchEvent(new CustomEvent('exerciseStateChanged'));
    }
  };

  const handleResetExercise = (exerciseId: string) => {
    const storedState = JSON.parse(sessionStorage.getItem('exerciseState') || '{}');
    if (storedState[exerciseId]) {
      delete storedState[exerciseId]; // Or set to initial state
      sessionStorage.setItem('exerciseState', JSON.stringify(storedState));
      window.dispatchEvent(new CustomEvent('exerciseStateChanged'));
    }
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
                   {exercise.status === 'Đã hoàn thành' && (
                      <div className="flex flex-col space-y-2">
                        {exercise.completionTime !== null && (
                          <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <Timer className="w-4 h-4 mr-1" />
                            <span>Thời gian hoàn thành: {formatDuration(exercise.completionTime)}</span>
                          </div>
                        )}
                        {exercise.score !== null && (
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            <span>Điểm: {exercise.score}/100</span>
                          </div>
                        )}
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
                      variant="outline"
                      className="w-full"
                      onClick={() => handleResetExercise(exercise.id)}
                      style={{ display: 'none' }}
                    >
                      Làm lại
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
