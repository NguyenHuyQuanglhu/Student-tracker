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
    { id: "it-software", name: "IT & Software", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course1" },
    { id: "programming", name: "Programming", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course2" },
    { id: "networking", name: "Networking", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course3" },
    { id: "network-security", name: "Network Security", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course4" },
    { id: "data-structures", name: "Data Structures", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course7" },
    { id: "machine-learning", name: "Machine Learning", progress: 0, status: "Paused" as CourseStatus, category: "Môn học" as CourseCategory, imageSeed: "course8" },
    { id: "public-speaking", name: "Public Speaking", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course5" },
    { id: "leadership", name: "Leadership", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course6" },
    { id: "project-management", name: "Project Management", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course9" },
    { id: "critical-thinking", name: "Critical Thinking", progress: 0, status: "Paused" as CourseStatus, category: "Kỹ năng" as CourseCategory, imageSeed: "course10" }
  ];
  

export type Status = 'inProgress' | 'completed' | 'notStarted';

export type Exercise = {
  id: string;
  title: string;
  course: string;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  status: 'Đã hoàn thành' | 'Đang làm' | 'Chưa bắt đầu';
  startTime: number | null;
  completionTime: number | null; // Duration in seconds
  score: number | null;
  targetTime: number; // Target time in seconds
};

export const exercises: Exercise[] = [
  { id: 'ex1', title: 'Viết thuật toán sắp xếp nổi bọt', course: 'Programming', difficulty: 'Dễ', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 600 },
  { id: 'ex2', title: 'Xây dựng một API RESTful đơn giản', course: 'IT & Software', difficulty: 'Trung bình', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 1800 },
  { id: 'ex3', title: 'Triển khai danh sách liên kết kép', course: 'Data Structures', difficulty: 'Trung bình', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 1200 },
  { id: 'ex4', title: 'Cấu hình một mạng con đơn giản', course: 'Networking', difficulty: 'Dễ', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 900 },
  { id: 'ex5', title: 'Tấn công SQL Injection và cách phòng chống', course: 'Network Security', difficulty: 'Khó', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 2100 },
  { id: 'ex6', title: 'Xây dựng mô hình hồi quy tuyến tính', course: 'Machine Learning', difficulty: 'Khó', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 3600 },
  { id: 'ex7', title: 'Gỡ lỗi một đoạn mã JavaScript phức tạp', course: 'Programming', difficulty: 'Khó', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 2400 },
  { id: 'ex8', title: 'Tối ưu hóa truy vấn cơ sở dữ liệu', course: 'IT & Software', difficulty: 'Trung bình', status: 'Chưa bắt đầu', startTime: null, completionTime: null, score: null, targetTime: 1500 },
];


// Add a version to the mock data
export const mockDataVersion = '1.25';
