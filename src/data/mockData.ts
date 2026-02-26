import { Course, Assignment, Submission, StudentProgress, User } from '@/types';

export const mockUsers: User[] = [
  { id: 't1', name: 'Ms. Sarah Johnson', email: 'sarah@school.edu', role: 'teacher' },
  { id: 's1', name: 'Alex Rivera', email: 'alex@school.edu', role: 'student' },
  { id: 's2', name: 'Maya Chen', email: 'maya@school.edu', role: 'student' },
  { id: 'p1', name: 'David Rivera', email: 'david@family.com', role: 'parent' },
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Science',
    description: 'Explore the wonders of the natural world through interactive and accessible lessons.',
    teacherId: 't1',
    teacherName: 'Ms. Sarah Johnson',
    enrolledStudents: ['s1', 's2'],
    color: 'primary',
    icon: '🔬',
    chapters: [
      {
        id: 'ch1',
        title: 'The Living World',
        description: 'Discover plants, animals, and ecosystems around us.',
        subchapters: [
          { id: 'sc1', title: 'What is Life?', content: 'Life is all around us. Plants grow, animals move, and tiny organisms live in places we cannot see. In this lesson, we explore what makes something alive.', mediaType: 'text' },
          { id: 'sc2', title: 'Plants Around Us', content: 'Plants are amazing living things that make their own food using sunlight. Let\'s learn about different types of plants and how they help us.', mediaType: 'video', mediaUrl: '#' },
          { id: 'sc3', title: 'Animal Kingdom', content: 'Animals come in all shapes and sizes. From tiny insects to giant whales, each animal has special features that help it survive.', mediaType: 'audio', mediaUrl: '#' },
        ],
      },
      {
        id: 'ch2',
        title: 'Matter and Materials',
        description: 'Understanding what things are made of.',
        subchapters: [
          { id: 'sc4', title: 'Solids, Liquids, and Gases', content: 'Everything around us is made of matter. Matter can be a solid like a rock, a liquid like water, or a gas like air.', mediaType: 'text' },
          { id: 'sc5', title: 'Mixing and Separating', content: 'When we mix things together, sometimes we can separate them again and sometimes we cannot. Let\'s explore!', mediaType: 'text' },
        ],
      },
    ],
  },
  {
    id: 'c2',
    title: 'Creative Mathematics',
    description: 'Learn math through visual patterns, games, and real-world examples.',
    teacherId: 't1',
    teacherName: 'Ms. Sarah Johnson',
    enrolledStudents: ['s1'],
    color: 'secondary',
    icon: '🧮',
    chapters: [
      {
        id: 'ch3',
        title: 'Numbers and Counting',
        description: 'Building a strong number sense foundation.',
        subchapters: [
          { id: 'sc6', title: 'Counting with Objects', content: 'Counting is one of the first math skills we learn. Using real objects makes counting fun and easy to understand.', mediaType: 'text' },
          { id: 'sc7', title: 'Number Patterns', content: 'Numbers follow patterns. When we see patterns, math becomes like solving a puzzle!', mediaType: 'text' },
        ],
      },
    ],
  },
  {
    id: 'c3',
    title: 'Art & Expression',
    description: 'Express yourself through colors, shapes, and creative activities.',
    teacherId: 't1',
    teacherName: 'Ms. Sarah Johnson',
    enrolledStudents: ['s1', 's2'],
    color: 'accent',
    icon: '🎨',
    chapters: [
      {
        id: 'ch4',
        title: 'Colors and Feelings',
        description: 'How colors connect to our emotions.',
        subchapters: [
          { id: 'sc8', title: 'Warm and Cool Colors', content: 'Colors can feel warm like sunshine or cool like water. Warm colors include red, orange, and yellow. Cool colors include blue, green, and purple.', mediaType: 'text' },
        ],
      },
    ],
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'The Living World Quiz',
    courseId: 'c1',
    chapterId: 'ch1',
    teacherId: 't1',
    difficulty: 'easy',
    dueDate: '2026-03-15',
    questions: [
      {
        id: 'q1', question: 'What do plants need to make their own food?', difficulty: 'easy',
        options: [
          { id: 'o1', text: 'Sunlight', isCorrect: true },
          { id: 'o2', text: 'Rocks', isCorrect: false },
          { id: 'o3', text: 'Sand', isCorrect: false },
          { id: 'o4', text: 'Metal', isCorrect: false },
        ],
      },
      {
        id: 'q2', question: 'Which of these is a living thing?', difficulty: 'easy',
        options: [
          { id: 'o5', text: 'A stone', isCorrect: false },
          { id: 'o6', text: 'A tree', isCorrect: true },
          { id: 'o7', text: 'A chair', isCorrect: false },
          { id: 'o8', text: 'A book', isCorrect: false },
        ],
      },
      {
        id: 'q3', question: 'What helps fish breathe underwater?', difficulty: 'medium',
        options: [
          { id: 'o9', text: 'Lungs', isCorrect: false },
          { id: 'o10', text: 'Gills', isCorrect: true },
          { id: 'o11', text: 'Wings', isCorrect: false },
          { id: 'o12', text: 'Legs', isCorrect: false },
        ],
      },
    ],
  },
  {
    id: 'a2',
    title: 'Counting Fun',
    courseId: 'c2',
    chapterId: 'ch3',
    teacherId: 't1',
    difficulty: 'easy',
    dueDate: '2026-03-20',
    questions: [
      {
        id: 'q4', question: 'What comes after 5?', difficulty: 'easy',
        options: [
          { id: 'o13', text: '4', isCorrect: false },
          { id: 'o14', text: '6', isCorrect: true },
          { id: 'o15', text: '7', isCorrect: false },
          { id: 'o16', text: '3', isCorrect: false },
        ],
      },
    ],
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub1', assignmentId: 'a1', studentId: 's1', studentName: 'Alex Rivera',
    answers: { q1: 'o1', q2: 'o6', q3: 'o10' }, score: 3, totalQuestions: 3,
    submittedAt: '2026-03-10',
    feedback: 'Excellent work, Alex! You understood the concepts perfectly. Keep exploring nature around you!',
    insights: 'Strong understanding of living things. Ready for more challenging content.',
  },
  {
    id: 'sub2', assignmentId: 'a1', studentId: 's2', studentName: 'Maya Chen',
    answers: { q1: 'o1', q2: 'o6', q3: 'o9' }, score: 2, totalQuestions: 3,
    submittedAt: '2026-03-11',
    feedback: 'Great effort, Maya! You got most questions right. Let\'s review how fish breathe — it\'s a fascinating topic!',
    insights: 'Good grasp of plant basics. Needs reinforcement on animal adaptations.',
  },
];

export const mockProgress: StudentProgress[] = [
  { studentId: 's1', studentName: 'Alex Rivera', courseId: 'c1', courseName: 'Introduction to Science', completedChapters: 1, totalChapters: 2, assignmentsCompleted: 1, averageScore: 100, lastActive: '2026-03-10' },
  { studentId: 's1', studentName: 'Alex Rivera', courseId: 'c2', courseName: 'Creative Mathematics', completedChapters: 0, totalChapters: 1, assignmentsCompleted: 0, averageScore: 0, lastActive: '2026-03-08' },
  { studentId: 's1', studentName: 'Alex Rivera', courseId: 'c3', courseName: 'Art & Expression', completedChapters: 1, totalChapters: 1, assignmentsCompleted: 0, averageScore: 0, lastActive: '2026-03-09' },
];
