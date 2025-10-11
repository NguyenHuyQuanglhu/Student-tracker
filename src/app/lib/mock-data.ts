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

const progressValues = [25, 50, 75, 100];

export const courseData = [
    { id: "it-software", name: "IT & Software", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course1" },
    { id: "programming", name: "Programming", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course2" },
    { id: "networking", name: "Networking", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course3" },
    { id: "network-security", name: "Network Security", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course4" },
    { id: "public-speaking", name: "Public Speaking", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course5" },
    { id: "leadership", name: "Leadership", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course6" },
    { id: "teamwork", name: "Teamwork", progress: progressValues[Math.floor(Math.random() * progressValues.length)], status: "Active" as CourseStatus, imageSeed: "course7" },
];
