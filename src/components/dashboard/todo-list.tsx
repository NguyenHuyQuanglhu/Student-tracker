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
import { todoList } from "@/app/lib/mock-data";

export function TodoList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">To-Do List</CardTitle>
        <CardDescription>Upcoming and incomplete assignments.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Status</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todoList.map((item) => (
              <TableRow key={item.id} className={item.completed ? 'text-muted-foreground line-through' : ''}>
                <TableCell>
                  <Checkbox id={`task-${item.id}`} checked={item.completed} aria-label={`Mark ${item.task} as complete`} />
                </TableCell>
                <TableCell className="font-medium">{item.task}</TableCell>
                <TableCell><Badge variant="secondary">{item.course}</Badge></TableCell>
                <TableCell className="text-right">{item.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
