import pool from './config/db.js'
import bcrypt from 'bcryptjs'

const seed = async () => {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    console.log('Clearing existing data...')
    await client.query('DELETE FROM enrollments')
    await client.query('DELETE FROM lessons')
    await client.query('DELETE FROM modules')
    await client.query('DELETE FROM courses')
    await client.query('DELETE FROM users')

    console.log('Seeding users...')
    const userIdMap = {}

    const usersData = [
      { oldId: 'u1',  name: 'Alice Johnson', email: 'alice@example.com',  password: 'hashedpassword1',  role: 'student',    joinedDate: '2025-09-15' },
      { oldId: 'u2',  name: 'Bob Smith',     email: 'bob@example.com',    password: 'hashedpassword2',  role: 'instructor', joinedDate: '2024-12-01' },
      { oldId: 'u3',  name: 'Carol Lee',     email: 'carol@example.com',  password: 'hashedpassword3',  role: 'student',    joinedDate: '2026-01-10' },
      { oldId: 'u4',  name: 'David Kim',     email: 'david@example.com',  password: 'hashedpassword4',  role: 'student',    joinedDate: '2025-05-22' },
      { oldId: 'u5',  name: 'Emma Brown',    email: 'emma@example.com',   password: 'hashedpassword5',  role: 'instructor', joinedDate: '2023-11-30' },
      { oldId: 'u6',  name: 'Liam Patel',    email: 'liam@example.com',   password: 'hashedpassword6',  role: 'student',    joinedDate: '2025-03-18' },
      { oldId: 'u7',  name: 'Sara Nguyen',   email: 'sara@example.com',   password: 'hashedpassword7',  role: 'student',    joinedDate: '2025-07-04' },
      { oldId: 'u8',  name: 'James Carter',  email: 'james@example.com',  password: 'hashedpassword8',  role: 'instructor', joinedDate: '2023-06-14' },
      { oldId: 'u9',  name: 'Mia Torres',    email: 'mia@example.com',    password: 'hashedpassword9',  role: 'student',    joinedDate: '2026-02-01' },
      { oldId: 'u10', name: 'Noah Williams', email: 'noah@example.com',   password: 'hashedpassword10', role: 'instructor', joinedDate: '2024-04-09' },
    ]

    for (const u of usersData) {
      const hash = await bcrypt.hash(u.password, 10)
      const result = await client.query(
        `INSERT INTO users (name, email, password_hash, role, joined_date, avatar)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [u.name, u.email, hash, u.role, u.joinedDate, '']
      )
      userIdMap[u.oldId] = result.rows[0].id
    }

    console.log('Seeding courses...')
    const courseIdMap = {}

    const coursesData = [
      { oldId: 'c1',  title: 'Complete JavaScript Course',    shortDescription: 'A comprehensive guide to JavaScript.',           description: 'Master JavaScript from basics to advanced concepts. Includes ES6, async programming, and more.', instructorOldId: 'u2',  category: 'Programming',    difficulty: 'Beginner',     image: 'https://images.pexels.com/photos/270557/pexels-photo-270557.jpeg',                                           duration: 75,  rating: 4.7, studentsCount: 120, createdAt: '2024-11-01' },
      { oldId: 'c2',  title: 'React for Beginners',           shortDescription: 'Start building apps with React.',                description: 'Learn how to build web apps using React. Covers components, state, and hooks.',                      instructorOldId: 'u5',  category: 'Web Development', difficulty: 'Intermediate',  image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',              duration: 95,  rating: 4.5, studentsCount: 80,  createdAt: '2025-01-15' },
      { oldId: 'c3',  title: 'CSS Layouts Mastery',           shortDescription: 'Become a CSS layout expert.',                   description: 'Master modern CSS layout techniques including Flexbox and Grid.',                                      instructorOldId: 'u5',  category: 'Design',          difficulty: 'Advanced',     image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg',                                          duration: 60,  rating: 4.8, studentsCount: 60,  createdAt: '2025-03-10' },
      { oldId: 'c4',  title: 'Node.js Essentials',            shortDescription: 'Learn Node.js for backend development.',        description: 'Get started with Node.js, Express, and building REST APIs.',                                          instructorOldId: 'u2',  category: 'Programming',    difficulty: 'Beginner',     image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',              duration: 70,  rating: 4.6, studentsCount: 90,  createdAt: '2026-02-20' },
      { oldId: 'c5',  title: 'Math 1: Foundations',           shortDescription: 'Essential math concepts for beginners.',        description: 'Learn arithmetic, algebra, and basic geometry. Perfect for students starting their math journey.',      instructorOldId: 'u5',  category: 'Mathematics',    difficulty: 'Beginner',     image: 'https://images.pexels.com/photos/4494641/pexels-photo-4494641.jpeg',                                          duration: 60,  rating: 4.9, studentsCount: 150, createdAt: '2025-07-10' },
      { oldId: 'c6',  title: 'English Language Basics',       shortDescription: 'Build your English skills from scratch.',       description: 'Covers grammar, vocabulary, and conversational English for beginners.',                                 instructorOldId: 'u2',  category: 'Language',       difficulty: 'Beginner',     image: 'https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-159581.jpeg',             duration: 55,  rating: 4.4, studentsCount: 110, createdAt: '2025-08-01' },
      { oldId: 'c7',  title: 'Python for Everyone',           shortDescription: 'Learn Python from the ground up.',              description: 'A beginner-friendly Python course covering syntax, data structures, and real-world scripting.',          instructorOldId: 'u8',  category: 'Programming',    difficulty: 'Beginner',     image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',                                          duration: 120, rating: 4.8, studentsCount: 200, createdAt: '2024-09-05' },
      { oldId: 'c8',  title: 'SQL and Databases',             shortDescription: 'Master relational databases with SQL.',         description: 'Learn to design, query, and manage relational databases using SQL from scratch.',                       instructorOldId: 'u8',  category: 'Programming',    difficulty: 'Intermediate',  image: 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg',                                          duration: 90,  rating: 4.5, studentsCount: 74,  createdAt: '2025-02-11' },
      { oldId: 'c9',  title: 'Git and Version Control',       shortDescription: 'Track and manage your code like a pro.',        description: 'Understand Git workflows, branching strategies, and collaboration using GitHub.',                         instructorOldId: 'u8',  category: 'Web Development', difficulty: 'Beginner',     image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',                                        duration: 65,  rating: 4.6, studentsCount: 135, createdAt: '2025-04-22' },
      { oldId: 'c10', title: 'UI/UX Design Fundamentals',     shortDescription: 'Design beautiful and usable interfaces.',       description: 'Learn the principles of UI/UX design including layout, color, typography, and responsive design.',        instructorOldId: 'u8',  category: 'Design',          difficulty: 'Intermediate',  image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',                                            duration: 115, rating: 4.7, studentsCount: 88,  createdAt: '2025-06-30' },
      { oldId: 'c11', title: 'Data Science with Python',      shortDescription: 'Analyze and visualize data using Python.',      description: 'Dive into data science using Python. Covers data cleaning, analysis, and visualization with Pandas and Matplotlib.', instructorOldId: 'u10', category: 'Programming',    difficulty: 'Advanced',     image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg',                                            duration: 130, rating: 4.9, studentsCount: 165, createdAt: '2024-10-17' },
      { oldId: 'c12', title: 'Responsive Web Design',         shortDescription: 'Build websites that work on any device.',       description: 'Learn how to create fully responsive websites using HTML, CSS, and media queries.',                       instructorOldId: 'u10', category: 'Web Development', difficulty: 'Intermediate',  image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',                                          duration: 85,  rating: 4.3, studentsCount: 52,  createdAt: '2025-11-03' },
      { oldId: 'c13', title: 'Math 2: Intermediate',          shortDescription: 'Build on your math foundations.',               description: 'Deepen your math skills with fractions, ratios, percentages, linear equations, and introductory statistics.', instructorOldId: 'u5',  category: 'Mathematics',    difficulty: 'Intermediate',  image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg',                                          duration: 150, rating: 4.8, studentsCount: 95,  createdAt: '2025-09-01' },
      { oldId: 'c14', title: 'English 2: Intermediate',       shortDescription: 'Take your English to the next level.',          description: 'Strengthen your English through reading comprehension, structured writing, grammar, and formal communication.', instructorOldId: 'u2',  category: 'Language',       difficulty: 'Intermediate',  image: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg',                                            duration: 150, rating: 4.6, studentsCount: 88,  createdAt: '2025-10-15' },
    ]

    for (const c of coursesData) {
      const result = await client.query(
        `INSERT INTO courses (title, short_description, description, instructor_id, category, difficulty, image_url, duration, rating, students_count, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [c.title, c.shortDescription, c.description, userIdMap[c.instructorOldId], c.category, c.difficulty, c.image, c.duration, c.rating, c.studentsCount, c.createdAt]
      )
      courseIdMap[c.oldId] = result.rows[0].id
    }

    console.log('Seeding modules...')
    const moduleIdMap = {}

    const modulesData = [
      { oldId: 'm1',  courseOldId: 'c1',  title: 'JavaScript Fundamentals', order: 1,  lessonOldIds: ['l1','l2'] },
      { oldId: 'm2',  courseOldId: 'c2',  title: 'React Introduction',       order: 2,  lessonOldIds: ['l3','l6'] },
      { oldId: 'm3',  courseOldId: 'c3',  title: 'CSS Mastery',               order: 3,  lessonOldIds: ['l4'] },
      { oldId: 'm4',  courseOldId: 'c4',  title: 'Node.js Basics',            order: 4,  lessonOldIds: ['l5'] },
      { oldId: 'm5',  courseOldId: 'c5',  title: 'Math Foundations',          order: 5,  lessonOldIds: ['l7','l8','l9'] },
      { oldId: 'm6',  courseOldId: 'c6',  title: 'English Basics',            order: 6,  lessonOldIds: ['l10','l11','l12'] },
      { oldId: 'm7',  courseOldId: 'c7',  title: 'Python Basics',             order: 7,  lessonOldIds: ['l13','l14','l15'] },
      { oldId: 'm8',  courseOldId: 'c8',  title: 'SQL Fundamentals',          order: 8,  lessonOldIds: ['l16','l17'] },
      { oldId: 'm9',  courseOldId: 'c9',  title: 'Git Essentials',            order: 9,  lessonOldIds: ['l18','l19'] },
      { oldId: 'm10', courseOldId: 'c10', title: 'UI/UX Core Concepts',       order: 10, lessonOldIds: ['l20','l21','l22'] },
      { oldId: 'm11', courseOldId: 'c11', title: 'Data Science Pipeline',     order: 11, lessonOldIds: ['l23','l24','l25'] },
      { oldId: 'm12', courseOldId: 'c12', title: 'Responsive Layouts',        order: 12, lessonOldIds: ['l4','l22'] },
      { oldId: 'm13', courseOldId: 'c13', title: 'Numbers and Operations',    order: 13, lessonOldIds: ['l26','l27','l28'] },
      { oldId: 'm14', courseOldId: 'c13', title: 'Equations and Data',        order: 14, lessonOldIds: ['l29','l30'] },
      { oldId: 'm15', courseOldId: 'c14', title: 'Reading and Writing',       order: 15, lessonOldIds: ['l31','l32','l33'] },
      { oldId: 'm16', courseOldId: 'c14', title: 'Grammar in Practice',       order: 16, lessonOldIds: ['l34','l35'] },
    ]

    for (const m of modulesData) {
      const result = await client.query(
        `INSERT INTO modules (course_id, title, module_order)
         VALUES ($1, $2, $3) RETURNING id`,
        [courseIdMap[m.courseOldId], m.title, m.order]
      )
      moduleIdMap[m.oldId] = { newId: result.rows[0].id, lessonOldIds: m.lessonOldIds }
    }

    console.log('Seeding lessons...')
    const lessonIdMap = {}

    const lessonsData = [
      { oldId: 'l1',  title: 'Introduction to JavaScript',       content: 'Learn the basics of JavaScript, including syntax and variables.',                    duration: 30, videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk' },
      { oldId: 'l2',  title: 'Advanced Functions',               content: 'Explore higher-order functions and closures in JavaScript.',                         duration: 45, videoUrl: 'https://www.youtube.com/watch?v=0aKZvNNf8BA' },
      { oldId: 'l3',  title: 'React Basics',                     content: 'Get started with React components and state management.',                            duration: 40, videoUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0' },
      { oldId: 'l4',  title: 'CSS Flexbox',                      content: 'Master layout techniques using CSS Flexbox.',                                        duration: 35, videoUrl: 'https://www.youtube.com/watch?v=JJSoEo8JSnc' },
      { oldId: 'l5',  title: 'Node.js Introduction',             content: 'Learn the basics of Node.js and server-side JavaScript.',                            duration: 50, videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4' },
      { oldId: 'l6',  title: 'React Hooks Deep Dive',            content: 'Understand React hooks and their advanced usage.',                                   duration: 55, videoUrl: 'https://www.youtube.com/watch?v=xfKYYRE6-TQ' },
      { oldId: 'l7',  title: 'Basic Arithmetic',                 content: 'Learn addition, subtraction, multiplication, and division.',                         duration: 25, videoUrl: 'https://www.youtube.com/watch?v=IwW0GJWKH98' },
      { oldId: 'l8',  title: 'Introduction to Algebra',          content: 'Understand variables, equations, and simple algebraic expressions.',                 duration: 30, videoUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI' },
      { oldId: 'l9',  title: 'Basic Geometry',                   content: 'Explore shapes, area, and perimeter.',                                               duration: 20, videoUrl: 'https://www.youtube.com/watch?v=gtMKsFXjLHw' },
      { oldId: 'l10', title: 'English Grammar Fundamentals',     content: 'Learn about nouns, verbs, adjectives, and sentence structure.',                      duration: 30, videoUrl: 'https://www.youtube.com/watch?v=SceDmiBEESI' },
      { oldId: 'l11', title: 'Vocabulary Building',              content: 'Expand your English vocabulary with common words and phrases.',                      duration: 20, videoUrl: 'https://www.youtube.com/watch?v=CQSUEKNOc6s' },
      { oldId: 'l12', title: 'Conversational English',           content: 'Practice basic English conversations for everyday situations.',                      duration: 35, videoUrl: 'https://www.youtube.com/watch?v=henIVlCPVIY' },
      { oldId: 'l13', title: 'Python Syntax and Variables',      content: 'Get familiar with Python syntax, data types, and variable assignment.',              duration: 35, videoUrl: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
      { oldId: 'l14', title: 'Python Control Flow',              content: 'Learn how to use if statements, loops, and functions in Python.',                    duration: 40, videoUrl: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk' },
      { oldId: 'l15', title: 'Python Lists and Dictionaries',    content: 'Work with Python collections including lists, tuples, and dictionaries.',            duration: 45, videoUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc' },
      { oldId: 'l16', title: 'Introduction to SQL',              content: 'Learn what databases are and how to write basic SQL queries.',                       duration: 40, videoUrl: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { oldId: 'l17', title: 'SQL Joins and Relationships',      content: 'Understand how to join tables and model relational data.',                           duration: 50, videoUrl: 'https://www.youtube.com/watch?v=9yeOJ0ZMUYw' },
      { oldId: 'l18', title: 'Git Basics',                       content: 'Learn version control fundamentals with Git: init, commit, and push.',               duration: 30, videoUrl: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { oldId: 'l19', title: 'Branching and Merging',            content: 'Work with Git branches, resolve merge conflicts, and use pull requests.',            duration: 35, videoUrl: 'https://www.youtube.com/watch?v=e2IbNHi4uCI' },
      { oldId: 'l20', title: 'UI Design Principles',             content: 'Understand core UI design principles: hierarchy, spacing, and typography.',          duration: 40, videoUrl: 'https://www.youtube.com/watch?v=yNDgFK2Jj1E' },
      { oldId: 'l21', title: 'Color Theory for Designers',       content: 'Learn how to use color effectively in digital interfaces.',                          duration: 30, videoUrl: 'https://www.youtube.com/watch?v=AvgCkHrcj8w' },
      { oldId: 'l22', title: 'Responsive Web Design',            content: 'Build layouts that adapt to any screen size using media queries.',                   duration: 45, videoUrl: 'https://www.youtube.com/watch?v=srvUrASNj0s' },
      { oldId: 'l23', title: 'Introduction to Data Science',     content: 'Overview of data science workflows, tools, and real-world applications.',            duration: 35, videoUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30' },
      { oldId: 'l24', title: 'Data Cleaning with Pandas',        content: 'Use the Pandas library to clean, filter, and transform datasets.',                  duration: 50, videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
      { oldId: 'l25', title: 'Data Visualization with Matplotlib', content: 'Create charts and graphs to explore and present data visually.',                  duration: 45, videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4' },
      { oldId: 'l26', title: 'Fractions and Decimals',           content: 'Master fractions, decimals, and how to convert between them.',                      duration: 30, videoUrl: 'https://www.youtube.com/watch?v=Z-ZkmpQBIFo' },
      { oldId: 'l27', title: 'Ratios and Proportions',           content: 'Understand ratios, rates, and proportional relationships.',                          duration: 28, videoUrl: 'https://www.youtube.com/watch?v=RQ2nYUBVvqI' },
      { oldId: 'l28', title: 'Percentages',                      content: 'Calculate percentages and apply them to real-world problems.',                       duration: 25, videoUrl: 'https://www.youtube.com/watch?v=JeVSmq1Nrpw' },
      { oldId: 'l29', title: 'Linear Equations',                 content: 'Solve one and two-step linear equations step by step.',                              duration: 35, videoUrl: 'https://www.youtube.com/watch?v=l3XzepN03KQ' },
      { oldId: 'l30', title: 'Introduction to Statistics',       content: 'Learn mean, median, mode, and basic data interpretation.',                           duration: 32, videoUrl: 'https://www.youtube.com/watch?v=hjZJIVWHnPE' },
      { oldId: 'l31', title: 'Reading Comprehension',            content: 'Improve your ability to understand and analyse written English texts.',              duration: 30, videoUrl: 'https://www.youtube.com/watch?v=TsRS0_MEdHY' },
      { oldId: 'l32', title: 'Writing Clear Sentences',          content: 'Learn how to write clear, grammatically correct sentences.',                         duration: 28, videoUrl: 'https://www.youtube.com/watch?v=9Z8s_GCbHTA' },
      { oldId: 'l33', title: 'Paragraph Structure',              content: 'Understand how to organise ideas into well-structured paragraphs.',                  duration: 25, videoUrl: 'https://www.youtube.com/watch?v=jgpuDCpDhEA' },
      { oldId: 'l34', title: 'Tenses and Time Expressions',      content: 'Master present, past, and future tenses with common time expressions.',              duration: 32, videoUrl: 'https://www.youtube.com/watch?v=LDi0QqPpOsY' },
      { oldId: 'l35', title: 'Email and Formal Writing',         content: 'Write professional emails and formal letters in English.',                           duration: 35, videoUrl: 'https://www.youtube.com/watch?v=uRnFjFPPBEk' },
    ]

    for (const [moduleOldId, moduleData] of Object.entries(moduleIdMap)) {
      for (let i = 0; i < moduleData.lessonOldIds.length; i++) {
        const lessonOldId = moduleData.lessonOldIds[i]
        const lessonData = lessonsData.find(l => l.oldId === lessonOldId)
        if (!lessonData) continue

        if (!lessonIdMap[lessonOldId]) {
          const result = await client.query(
            `INSERT INTO lessons (module_id, title, content, duration, video_url, lesson_order)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [moduleData.newId, lessonData.title, lessonData.content, lessonData.duration, lessonData.videoUrl, i + 1]
          )
          lessonIdMap[lessonOldId] = result.rows[0].id
        } else {
          await client.query(
            `INSERT INTO lessons (module_id, title, content, duration, video_url, lesson_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [moduleData.newId, lessonData.title, lessonData.content, lessonData.duration, lessonData.videoUrl, i + 1]
          )
        }
      }
    }

    console.log('Seeding enrollments...')

    const enrollmentsData = [
      { userOldId: 'u1', courseOldId: 'c1', progress: 100 },
      { userOldId: 'u1', courseOldId: 'c2', progress: 40  },
      { userOldId: 'u1', courseOldId: 'c3', progress: 0   },
      { userOldId: 'u2', courseOldId: 'c3', progress: 100 },
      { userOldId: 'u3', courseOldId: 'c2', progress: 60  },
      { userOldId: 'u3', courseOldId: 'c4', progress: 10  },
      { userOldId: 'u4', courseOldId: 'c1', progress: 20  },
      { userOldId: 'u4', courseOldId: 'c4', progress: 50  },
      { userOldId: 'u6', courseOldId: 'c5', progress: 100 },
      { userOldId: 'u6', courseOldId: 'c6', progress: 75  },
      { userOldId: 'u6', courseOldId: 'c7', progress: 30  },
      { userOldId: 'u6', courseOldId: 'c8', progress: 0   },
      { userOldId: 'u7', courseOldId: 'c1', progress: 80  },
      { userOldId: 'u7', courseOldId: 'c7', progress: 100 },
      { userOldId: 'u7', courseOldId: 'c9', progress: 55  },
      { userOldId: 'u8', courseOldId: 'c2', progress: 90  },
      { userOldId: 'u9', courseOldId: 'c3', progress: 15  },
      { userOldId: 'u9', courseOldId: 'c5', progress: 100 },
      { userOldId: 'u9', courseOldId: 'c10', progress: 65 },
      { userOldId: 'u9', courseOldId: 'c11', progress: 0  },
    ]

    for (const e of enrollmentsData) {
      await client.query(
        `INSERT INTO enrollments (user_id, course_id, progress)
         VALUES ($1, $2, $3)`,
        [userIdMap[e.userOldId], courseIdMap[e.courseOldId], e.progress]
      )
    }

    await client.query('COMMIT')
    console.log('✅ Database seeded successfully!')

  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Seed failed:', err.message)
  } finally {
    client.release()
    process.exit()
  }
}

seed()