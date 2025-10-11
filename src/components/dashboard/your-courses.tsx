import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { todoList } from "@/app/lib/mock-data";
import Image from "next/image";

type CourseStatus = 'Active' | 'Finished' | 'Paused';

const courseData = [
    { name: "IT & Software", daysLeft: "45 Days Left", status: "Active" as CourseStatus, imageSeed: "course1" },
    { name: "Programming", daysLeft: "1 Days Left", status: "Finished" as CourseStatus, imageSeed: "course2" },
    { name: "Networking", daysLeft: "15 Days Left", status: "Active" as CourseStatus, imageSeed: "course3" },
    { name: "Network Security", daysLeft: "21 Days Left", status: "Paused" as CourseStatus, imageSeed: "course4" },
];

const statusColors: Record<CourseStatus, string> = {
    Active: "bg-blue-100 text-blue-800",
    Finished: "bg-gray-100 text-gray-800",
    Paused: "bg-yellow-100 text-yellow-800",
}

export function YourCourses() {
  return (
    <div>
        <h3 className="text-xl font-bold mb-4">Các khóa học của bạn</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseData.map((course) => (
                <Card key={course.name} className="relative overflow-hidden">
                    <CardHeader>
                        <Badge className={`w-fit ${statusColors[course.status]}`}>{course.status}</Badge>
                        <CardTitle className="pt-2">{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{course.daysLeft}</CardDescription>
                    </CardContent>
                    <Image 
                        src={`https://picsum.photos/seed/${course.imageSeed}/100/100`} 
                        alt="Course Illustration"
                        width={80}
                        height={100}
                        className="absolute bottom-0 right-4"
                        data-ai-hint="person graduation"
                    />
                </Card>
            ))}
        </div>
    </div>
  )
}
