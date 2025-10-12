export const user = {
  name: 'Alex Doe',
  email: 'alex.doe@university.edu',
};

export const progressOverview = {
  overallCompletion: 78,
  courses: [
    { name: 'Quantum Physics', score: 85 },
    { name: 'Organic Chemistry', score: 92 },
    { name: 'Data Structures', score: 72 },
    { name: 'World History', score: 68 },
    { name: 'Creative Writing', score: 88 },
  ],
};

export const softSkills = [
  { skill: 'Teamwork', value: 80 },
  { skill: 'Communication', value: 90 },
  { skill: 'Problem Solving', value: 75 },
  { skill: 'Leadership', value: 65 },
  { skill: 'Creativity', value: 95 },
  { skill: 'Time Management', value: 70 },
];

export const todoList = [
  { id: '1', task: 'Submit IT & Software project', course: 'IT & Software', dueDate: '3 ngày', completed: false },
  { id: '2', task: 'Complete Programming assignment', course: 'Programming', dueDate: '5 ngày', completed: false },
  { id: '3', task: 'Networking lab report', course: 'Networking', dueDate: '1 tuần', completed: false },
  { id: '4', task: 'Read Chapter 5', course: 'Network Security', dueDate: '2 tuần', completed: true },
  { id: '5', task: 'Prepare presentation', course: 'Public Speaking', dueDate: '1 ngày', completed: false },
];

export const warnings = [
  { id: '1', message: 'Bạn có nguy cơ trượt môn Lịch sử thế giới. Điểm hiện tại của bạn là 68%.' },
  { id: '2', message: 'Bài Cơ học lượng tử sẽ hết hạn trong 3 ngày nữa.' },
];

export type CourseStatus = 'Active' | 'Finished' | 'Paused';
export type CourseCategory = 'Môn học' | 'Kỹ năng';

export const courseData = [
    { id: "it-software", name: "IT & Software", progress: 25, status: "Active" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course1" },
    { id: "programming", name: "Programming", progress: 75, status: "Active" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course2" },
    { id: "networking", name: "Networking", progress: 50, status: "Active" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course3" },
    { id: "network-security", name: "Network Security", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course4" },
    { id: "data-structures", name: "Cấu trúc dữ liệu & Thuật toán", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course8" },
    { id: "web-development", name: "Phát triển Web", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course9" },
    { id: "python-programming", name: "Lập trình Python", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course10" },
    { id: "mobile-development", name: "Phát triển di động", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course11" },
    { id: "cloud-computing", name: "Điện toán đám mây", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course12" },
    { id: "public-speaking", name: "Public Speaking", progress: 25, status: "Active" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course5" },
    { id: "leadership", name: "Leadership", progress: 50, status: "Active" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course6" },
    { id: "teamwork", name: "Teamwork", progress: 75, status: "Active" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course7" },
    { id: "time-management", name: "Time Management", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course13" },
    { id: "problem-solving", name: "Problem Solving", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course14" },
    { id: "critical-thinking", name: "Critical Thinking", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course15" },
];

export type Status = 'inProgress' | 'completed' | 'notStarted';
