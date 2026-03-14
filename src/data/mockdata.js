// Users
export const users = [
	{
		id: 'u1',
		name: 'Alice Johnson',
		email: 'alice@example.com',
		password: 'hashedpassword1',
		role: 'student',
		enrolledCourses: ['c1', 'c2', 'c3'],
		createdCourses: [],
		avatar: '',
		joinedDate: '2025-09-15',
		progress: {
			c1: 80,
			c2: 40,
			c3: 0,
		},
	},
	{
		id: 'u2',
		name: 'Bob Smith',
		email: 'bob@example.com',
		password: 'hashedpassword2',
		role: 'instructor',
		enrolledCourses: ['c3'],
		createdCourses: ['c1', 'c3'],
		avatar: '',
		joinedDate: '2024-12-01',
		progress: {
			c3: 100,
		},
	},
	{
		id: 'u3',
		name: 'Carol Lee',
		email: 'carol@example.com',
		password: 'hashedpassword3',
		role: 'student',
		enrolledCourses: ['c2', 'c4'],
		createdCourses: [],
		avatar: '',
		joinedDate: '2026-01-10',
		progress: {
			c2: 60,
			c4: 10,
		},
	},
	{
		id: 'u4',
		name: 'David Kim',
		email: 'david@example.com',
		password: 'hashedpassword4',
		role: 'student',
		enrolledCourses: ['c1', 'c4'],
		createdCourses: [],
		avatar: '',
		joinedDate: '2025-05-22',
		progress: {
			c1: 20,
			c4: 50,
		},
	},
	{
		id: 'u5',
		name: 'Emma Brown',
		email: 'emma@example.com',
		password: 'hashedpassword5',
		role: 'instructor',
		enrolledCourses: [],
		createdCourses: ['c2', 'c4'],
		avatar: '',
		joinedDate: '2023-11-30',
		progress: {},
	},
];

// Lessons 
export const lessons = [ 
	{ 
	    id: 'l1', 
		title: 'Introduction to JavaScript', 
		content: 'Learn the basics of JavaScript, including syntax and variables.', 
		duration: 30, // minutes 
		videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 
	}, 
	{ 
		id: 'l2', 
		title: 'Advanced Functions', 
		content: 'Explore higher-order functions and closures in JavaScript.', 
		duration: 45, 
		videoUrl: 'https://www.youtube.com/watch?v=8hWl6bG2RkY', 
	}, 
	{ 
		id: 'l3', 
		title: 'React Basics', 
		content: 'Get started with React components and state management.', 
		duration: 40, 
		videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0', 
	}, 
	{ 
		id: 'l4', 
		title: 'CSS Flexbox', 
		content: 'Master layout techniques using CSS Flexbox.', 
		duration: 35, 
		videoUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc', 
	}, 
	{ 
		id: 'l5', 
		title: 'Node.js Introduction', 
		content: 'Learn the basics of Node.js and server-side JavaScript.', 
		duration: 50, 
		videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', 
	}, 
	{ 
		id: 'l6', 
		title: 'React Hooks Deep Dive', 
		content: 'Understand React hooks and their advanced usage.', 
		duration: 55, 
		videoUrl: 'https://www.youtube.com/watch?v=dpw9EHD9LbA', 
	}, 
	{ 
		id: 'l7', 
		title: 'Basic Arithmetic', 
		content: 'Learn addition, subtraction, multiplication, and division.', 
		duration: 25, 
		videoUrl: 'https://www.youtube.com/watch?v=1Fq3VZc2w2w', 
	}, 
	{ 
		id: 'l8', title: 'Introduction to Algebra', 
		content: 'Understand variables, equations, and simple algebraic expressions.', 
		duration: 30, 
		videoUrl: 'https://www.youtube.com/watch?v=QwT6tA5tHnY', 
	}, 
	{ 
		id: 'l9', 
		title: 'Basic Geometry', 
		content: 'Explore shapes, area, and perimeter.', 
		duration: 20, 
		videoUrl: 'https://www.youtube.com/watch?v=QJY5b3W1t5I', 
	}, 
	{ 
		id: 'l10', 
		title: 'English Grammar Fundamentals', 
		content: 'Learn about nouns, verbs, adjectives, and sentence structure.', 
		duration: 30, 
		videoUrl: 'https://www.youtube.com/watch?v=FQ4Fz8rP2jY', 
	}, 
	{ 
		id: 'l11', 
		title: 'Vocabulary Building', 
		content: 'Expand your English vocabulary with common words and phrases.', 
		duration: 20, 
		videoUrl: 'https://www.youtube.com/watch?v=JkQq8rQkBqY', 
	}, 
	{ 
		id: 'l12', 
		title: 'Conversational English', 
		content: 'Practice basic English conversations for everyday situations.', 
		duration: 35, 
		videoUrl: 'https://www.youtube.com/watch?v=3k9h1gk8QW8', 
	}, 

]; 
//Courses
export const courses = [
  {
    id: 'c1',
    title: 'Complete JavaScript Course',
    shortDescription: 'A comprehensive guide to JavaScript.',
    description:
      'Master JavaScript from basics to advanced concepts. Includes ES6, async programming, and more.',
    instructorId: 'u2',
    category: 'Programming',
    difficulty: 'Beginner',
    image:
      'https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg',
    duration: 75, // minutes
    rating: 4.7,
    studentsCount: 120,
    modules: ['m1', 'm3'],
    createdAt: '2024-11-01',
  },
  {
    id: 'c2',
    title: 'React for Beginners',
    shortDescription: 'Start building apps with React.',
    description:
      'Learn how to build web apps using React. Covers components, state, and hooks.',
    instructorId: 'u5',
    category: 'Web Development',
    difficulty: 'Intermediate',
    image:
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    duration: 95,
    rating: 4.5,
    studentsCount: 80,
    modules: ['m2'],
    createdAt: '2025-01-15',
  },
  {
    id: 'c3',
    title: 'CSS Layouts Mastery',
    shortDescription: 'Become a CSS layout expert.',
    description:
      'Master modern CSS layout techniques including Flexbox and Grid.',
    instructorId: 'u5',
    category: 'Design',
    difficulty: 'Advanced',
    image:
      'https://images.pexels.com/photos/12081657/pexels-photo-12081657.jpeg',
    duration: 60,
    rating: 4.8,
    studentsCount: 60,
    modules: ['m3'],
    createdAt: '2025-03-10',
  },
  {
    id: 'c4',
    title: 'Node.js Essentials',
    shortDescription: 'Learn Node.js for backend development.',
    description:
      'Get started with Node.js, Express, and building REST APIs.',
    instructorId: 'u2',
    category: 'Programming',
    difficulty: 'Beginner',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    duration: 70,
    rating: 4.6,
    studentsCount: 90,
    modules: ['m4'],
    createdAt: '2026-02-20',
  },
  {
    id: 'c5',
    title: 'Math 1: Foundations',
    shortDescription: 'Essential math concepts for beginners.',
    description:
      'Learn arithmetic, algebra, and basic geometry. Perfect for students starting their math journey.',
    instructorId: 'u5',
    category: 'Mathematics',
    difficulty: 'Beginner',
    image:
      'https://images.pexels.com/photos/4494641/pexels-photo-4494641.jpeg',
    duration: 60,
    rating: 4.9,
    studentsCount: 150,
    modules: ['m5'],
    createdAt: '2025-07-10',
  },
  {
    id: 'c6',
    title: 'English Language Basics',
    shortDescription: 'Build your English skills from scratch.',
    description:
      'Covers grammar, vocabulary, and conversational English for beginners.',
    instructorId: 'u2',
    category: 'Language',
    difficulty: 'Beginner',
    image:
      'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg',
    duration: 55,
    rating: 4.4,
    studentsCount: 110,
    modules: ['m6'],
    createdAt: '2025-08-01',
  },
];
//Modules 
 export const modules = [ { id: 'm1', title: 'JavaScript Fundamentals', order: 1, lessons: ['l1', 'l2'], }, { id: 'm2', title: 'React Introduction', order: 2, lessons: ['l3', 'l6'], }, { id: 'm3', title: 'CSS Mastery', order: 3, lessons: ['l4'], }, { id: 'm4', title: 'Node.js Basics', order: 4, lessons: ['l5'], }, { id: 'm5', title: 'Math Foundations', order: 5, lessons: ['l7', 'l8', 'l9'], }, 
 { id: 'm6', title: 'English Basics', order: 6, lessons: ['l10', 'l11', 'l12'], }, ];
