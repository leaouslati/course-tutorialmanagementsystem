import pool from '../config/db.js'

// Normalize DB row (snake_case) → camelCase for the frontend
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
})

export const getCourses = async (req, res) => {
  try {
    const { instructorId } = req.query
    let result
    if (instructorId && instructorId !== 'me') {
      result = await pool.query('SELECT * FROM courses WHERE instructor_id = $1 ORDER BY id DESC', [instructorId])
    } else {
      result = await pool.query('SELECT * FROM courses ORDER BY id DESC')
    }
    res.json(result.rows.map(normalize))
  } catch (error) {
    console.error('getCourses error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCourseById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ message: 'Course not found.' })
    res.json(normalize(result.rows[0]))
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
