import jwt from 'jsonwebtoken'
import pool from '../config/db.js'

const normalize = (row) => ({
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
})

export const getStats = async (req, res) => {
  try {
    const [coursesResult, studentsResult, ratingResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM courses'),
      pool.query('SELECT SUM(students_count) FROM courses'),
      pool.query('SELECT AVG(rating) FROM courses'),
    ])

    const totalCourses = parseInt(coursesResult.rows[0].count, 10)
    const totalStudents = parseInt(studentsResult.rows[0].sum ?? 0, 10)
    const avg = parseFloat(ratingResult.rows[0].avg ?? 0)

    res.json({
      totalCourses,
      totalStudents,
      averageRating: avg.toFixed(1),
    })
  } catch (error) {
    console.error('getStats error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCourses = async (req, res) => {
  try {
    const { category, difficulty, instructorId, search, sortRating, sortTime } = req.query

    const conditions = []
    const params = []

    if (category) {
      params.push(category)
      conditions.push(`c.category = $${params.length}`)
    }

    if (difficulty) {
      params.push(difficulty)
      conditions.push(`c.difficulty = $${params.length}`)
    }

    if (instructorId) {
      let resolvedId = instructorId
      if (instructorId === 'me') {
        const header = req.headers.authorization
        if (!header || !header.startsWith('Bearer ')) {
          return res.status(401).json({ message: 'Authentication required.' })
        }
        try {
          const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'secret')
          resolvedId = decoded.id
        } catch {
          return res.status(401).json({ message: 'Invalid or expired token' })
        }
      }
      params.push(resolvedId)
      conditions.push(`c.instructor_id = $${params.length}`)
    }

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`c.title ILIKE $${params.length}`)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const orderParts = []
    if (sortRating === 'asc') orderParts.push('c.rating ASC')
    else if (sortRating === 'desc') orderParts.push('c.rating DESC')
    if (sortTime === 'asc') orderParts.push('c.duration ASC')
    else if (sortTime === 'desc') orderParts.push('c.duration DESC')
    const order = orderParts.length > 0 ? `ORDER BY ${orderParts.join(', ')}` : 'ORDER BY c.id DESC'

    const result = await pool.query(
      `SELECT c.*, u.name AS instructor_name
       FROM courses c
       JOIN users u ON u.id = c.instructor_id
       ${where}
       ${order}`,
      params
    )

    res.json(result.rows.map(normalize))
  } catch (error) {
    console.error('getCourses error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params

    const courseResult = await pool.query(
      `SELECT c.*, u.name AS instructor_name
       FROM courses c
       JOIN users u ON u.id = c.instructor_id
       WHERE c.id = $1`,
      [id]
    )
    if (courseResult.rows.length === 0) return res.status(404).json({ message: 'Course not found.' })

    const modulesResult = await pool.query(
      'SELECT * FROM modules WHERE course_id = $1 ORDER BY module_order ASC',
      [id]
    )
    const moduleRows = modulesResult.rows

    let modules = []
    if (moduleRows.length > 0) {
      const moduleIds = moduleRows.map((m) => m.id)
      const lessonsResult = await pool.query(
        'SELECT * FROM lessons WHERE module_id = ANY($1::uuid[]) ORDER BY lesson_order ASC',
        [moduleIds]
      )

      const lessonsByModule = {}
      for (const lesson of lessonsResult.rows) {
        if (!lessonsByModule[lesson.module_id]) lessonsByModule[lesson.module_id] = []
        lessonsByModule[lesson.module_id].push({
          id: lesson.id,
          title: lesson.title,
          content: lesson.content,
          duration: lesson.duration,
          videoUrl: lesson.video_url,
          lessonOrder: lesson.lesson_order,
        })
      }

      modules = moduleRows.map((mod) => ({
        id: mod.id,
        title: mod.title,
        moduleOrder: mod.module_order,
        lessons: lessonsByModule[mod.id] ?? [],
      }))
    }

    res.json({ ...normalize(courseResult.rows[0]), modules })
  } catch (error) {
    console.error('getCourseById error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied. Instructors only.' })
    }

    const { title, shortDescription, description, category, difficulty, duration, image } = req.body

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' })
    }

    const result = await pool.query(
      `INSERT INTO courses (title, short_description, description, category, difficulty, duration, image_url, instructor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, shortDescription, description, category, difficulty, duration, image, req.user.id]
    )

    res.status(201).json(normalize(result.rows[0]))
  } catch (error) {
    console.error('createCourse error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params

    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id])
    if (courseResult.rows.length === 0) return res.status(404).json({ message: 'Course not found.' })

    if (courseResult.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course.' })
    }

    const { title, shortDescription, description, category, difficulty, duration, image } = req.body

    const updated = await pool.query(
      `UPDATE courses
       SET title = COALESCE($1, title),
           short_description = COALESCE($2, short_description),
           description = COALESCE($3, description),
           category = COALESCE($4, category),
           difficulty = COALESCE($5, difficulty),
           duration = COALESCE($6, duration),
           image_url = COALESCE($7, image_url)
       WHERE id = $8
       RETURNING *`,
      [title, shortDescription, description, category, difficulty, duration, image, id]
    )

    res.status(200).json(normalize(updated.rows[0]))
  } catch (error) {
    console.error('updateCourse error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params

    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id])
    if (courseResult.rows.length === 0) return res.status(404).json({ message: 'Course not found.' })

    if (courseResult.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course.' })
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [id])
    res.status(204).send()
  } catch (error) {
    console.error('deleteCourse error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}