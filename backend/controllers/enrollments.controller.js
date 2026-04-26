import pool from '../config/db.js'

// Convert a snake_case DB row into the camelCase shape the frontend expects,
// including the progress field that comes from the enrollments join
const normalizeCourse = (row) => ({
  id: row.id,
  title: row.title,
  shortDescription: row.short_description,
  description: row.description,
  category: row.category,
  difficulty: row.difficulty,
  duration: row.duration,
  rating: row.rating,
  studentsCount: row.students_count ?? 0,
  image: row.image_url,
  instructorId: row.instructor_id,
  instructorName: row.instructor_name ?? null,
  createdAt: row.created_at,
  progress: row.progress ?? 0,
})

// Return all courses the authenticated student is enrolled in, with their progress
export const getMyEnrollments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*,
              u.name AS instructor_name,
              e.progress
         FROM enrollments e
         JOIN courses c ON c.id = e.course_id
         JOIN users   u ON u.id = c.instructor_id
        WHERE e.user_id = $1
        ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    )
    res.json(result.rows.map(normalizeCourse))
  } catch (error) {
    console.error('getMyEnrollments error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Return { enrolled: true/false } — used by CourseDetails to show the correct button on load
export const getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params

    const result = await pool.query(
      'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    )

    res.json({ enrolled: result.rows.length > 0 })
  } catch (error) {
    console.error('getEnrollmentStatus error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Enroll the authenticated student in a course; only students (not instructors) may enroll
export const enroll = async (req, res) => {
  try {
    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({ error: 'courseId is required' })
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Instructors cannot enroll in courses' })
    }

    // ON CONFLICT DO NOTHING makes the duplicate check atomic — no race condition
    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id, progress)
       VALUES ($1, $2, 0)
       ON CONFLICT (user_id, course_id) DO NOTHING
       RETURNING *`,
      [req.user.id, courseId]
    )

    if (result.rowCount === 0) {
      return res.status(409).json({ message: 'Already enrolled in this course' })
    }

    await pool.query(
      `UPDATE courses SET students_count = students_count + 1 WHERE id = $1`,
      [courseId]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('enroll error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Remove the authenticated student's enrollment from a course
export const unenroll = async (req, res) => {
  try {
    const { courseId } = req.params

    const result = await pool.query(
      'DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' })
    }

    await pool.query(
      `UPDATE courses SET students_count = GREATEST(students_count - 1, 0) WHERE id = $1`,
      [courseId]
    )

    res.status(204).send()
  } catch (error) {
    console.error('unenroll error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update the student's progress percentage (0–100) for an enrolled course
export const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params
    const { progress } = req.body

    if (progress === undefined || progress === null) {
      return res.status(400).json({ error: 'progress is required' })
    }

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ error: 'progress must be a number between 0 and 100' })
    }

    const result = await pool.query(
      `UPDATE enrollments
          SET progress = $1
        WHERE user_id = $2 AND course_id = $3
        RETURNING progress`,
      [progress, req.user.id, courseId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' })
    }

    res.json({ progress: result.rows[0].progress })
  } catch (error) {
    console.error('updateProgress error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
