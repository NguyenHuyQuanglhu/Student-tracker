'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

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
    
    // Get courses that have been started but not finished
    const inProgressCourses: TodoItem[] = courseData
      .filter(course => {
        const state = courseProgress[course.id];
        const progress = state ? state.progress : course.progress;
        return progress > 0 && progress < 100;
      })
      .map(course => ({
        id: `course-${course.id}`,
        task: `Tiếp tục học ${course.name}`,
        course: course.category,
        type: 'Khóa học',
        completed: false, // In-progress courses are not completed
      }));

    // Get exercises that are not started
    const notStartedExercises: TodoItem[] = mockExercises
        .filter(ex => {
            const state = exerciseState[ex.id];
            return !state || state.status === 'Chưa bắt đầu';
        })
        .map(ex => ({
            id: `exercise-${ex.id}`,
            task: `Làm bài tập ${ex.title}`,
            course: ex.course,
            type: 'Bài tập',
            completed: false
        }));
    
    setTodoItems([...inProgressCourses, ...notStartedExercises]);
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

  const handleRowClick = (item: TodoItem) => {
    if (item.type === 'Khóa học') {
      const courseId = item.id.replace('course-', '');
      router.push(`/courses/${courseId}`);
    } else {
      router.push('/exercises');
    }
  };

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
                    <TableRow 
                        key={item.id} 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleRowClick(item)}
                    >
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
