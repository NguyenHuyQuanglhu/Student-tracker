'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { courseData, mockDataVersion, exercises as mockExercises, CourseStatus } from "@/app/lib/mock-data";

type TodoItem = {
  id: string;
  task: string;
  course: string;
  type: 'Khóa học' | 'Bài tập';
  completed: boolean;
};

const typeColors: Record<TodoItem['type'], string> = {
    'Khóa học': "bg-blue-100 text-blue-800",
    'Bài tập': "bg-green-100 text-green-800",
}

export function TodoList() {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const updateTodoList = () => {
    if (typeof window === 'undefined') return;

    // Ensure mock data version is consistent
    if (localStorage.getItem('mockDataVersion') !== mockDataVersion) {
        localStorage.removeItem('courseProgress');
        localStorage.removeItem('exerciseState');
        localStorage.setItem('mockDataVersion', mockDataVersion);
    }
    
    const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    const exerciseState = JSON.parse(localStorage.getItem('exerciseState') || '{}');

    // Get active courses
    const activeCourses: TodoItem[] = courseData
      .filter(course => {
        const state = courseProgress[course.id];
        const status = state ? state.status as CourseStatus : course.status;
        return status === 'Active';
      })
      .map(course => ({
        id: `course-${course.id}`,
        task: `Tiếp tục học ${course.name}`,
        course: course.category,
        type: 'Khóa học',
        completed: false, // Active courses are not completed
      }));
    
    // Get unstarted exercises
    const unstartedExercises: TodoItem[] = mockExercises
        .filter(exercise => {
            const state = exerciseState[exercise.id];
            return !state || state.status === 'Chưa bắt đầu';
        })
        .map(exercise => ({
            id: `ex-${exercise.id}`,
            task: exercise.title,
            course: exercise.course,
            type: 'Bài tập',
            completed: false,
        }));
    
    setTodoItems([...activeCourses, ...unstartedExercises]);
    setLoading(false);
  };
  
  useEffect(() => {
    updateTodoList();

    window.addEventListener('courseStateChanged', updateTodoList);
    window.addEventListener('exerciseStateChanged', updateTodoList);

    return () => {
        window.removeEventListener('courseStateChanged', updateTodoList);
        window.removeEventListener('exerciseStateChanged', updateTodoList);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Danh sách công việc</CardTitle>
        <CardDescription>Các khóa học và bài tập cần hoàn thành.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Trạng thái</TableHead>
              <TableHead>Nhiệm vụ</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Khóa học liên quan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        Đang tải danh sách công việc...
                    </TableCell>
                </TableRow>
            ) : todoItems.length > 0 ? (
                todoItems.map((item) => (
                    <TableRow key={item.id} className={item.completed ? 'text-muted-foreground line-through' : ''}>
                        <TableCell>
                        <Checkbox id={`task-${item.id}`} checked={item.completed} aria-label={`Mark ${item.task} as complete`} disabled />
                        </TableCell>
                        <TableCell className="font-medium">{item.task}</TableCell>
                        <TableCell><Badge className={typeColors[item.type]}>{item.type}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{item.course}</Badge></TableCell>
                    </TableRow>
                ))
            ) : (
                 <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                       Tuyệt vời! Bạn không có công việc nào cần làm ngay.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
