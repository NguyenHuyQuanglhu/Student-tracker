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
  { id: '1', task: 'Submit Quantum Mechanics paper', course: 'Quantum Physics', dueDate: '3 days', completed: false },
  { id: '2', task: 'Lab report #5', course: 'Organic Chemistry', dueDate: '5 days', completed: false },
  { id: '3', task: 'Final Project Proposal', course: 'Data Structures', dueDate: '1 week', completed: false },
  { id: '4', task: 'Read Chapter 12', course: 'World History', dueDate: '2 weeks', completed: true },
];

export const warnings = [
  { id: '1', message: 'You are at risk of failing World History. Your current score is 68%.' },
  { id: '2', message: 'Quantum Mechanics paper is due in 3 days.' },
];
