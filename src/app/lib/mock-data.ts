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
  { id: '1', task: 'Nộp bài Cơ học lượng tử', course: 'Quantum Physics', dueDate: '3 ngày', completed: false },
  { id: '2', task: 'Báo cáo lab số 5', course: 'Organic Chemistry', dueDate: '5 ngày', completed: false },
  { id: '3', task: 'Đề xuất dự án cuối kỳ', course: 'Data Structures', dueDate: '1 tuần', completed: false },
  { id: '4', task: 'Đọc chương 12', course: 'World History', dueDate: '2 tuần', completed: true },
];

export const warnings = [
  { id: '1', message: 'Bạn có nguy cơ trượt môn Lịch sử thế giới. Điểm hiện tại của bạn là 68%.' },
  { id: '2', message: 'Bài Cơ học lượng tử sẽ hết hạn trong 3 ngày nữa.' },
];

export type CourseStatus = 'Active' | 'Finished' | 'Paused';

export const courseData = [
    { id: "it-software", name: "IT & Software", progress: 60, status: "Active" as CourseStatus, imageSeed: "course1" },
    { id: "programming", name: "Programming", progress: 100, status: "Finished" as CourseStatus, imageSeed: "course2" },
    { id: "networking", name: "Networking", progress: 25, status: "Active" as CourseStatus, imageSeed: "course3" },
    { id: "network-security", name: "Network Security", progress: 10, status: "Paused" as CourseStatus, imageSeed: "course4" },
];
