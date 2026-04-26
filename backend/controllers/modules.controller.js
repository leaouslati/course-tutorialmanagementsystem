import pool from '../config/db.js'

// Add a new module to a course; appends it at the end using the current max module_order + 1
export const createModule = async (req, res) => {
  try {
    const { courseId, title } = req.body

    if (!courseId || !title) {
      return res.status(400).json({ error: 'courseId and title are required' })
    }

    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [courseId]
    )

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const course = courseResult.rows[0]

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: you do not own this course' })
    }

    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(module_order), 0) AS max_order FROM modules WHERE course_id = $1',
      [courseId]
    )

    const nextOrder = parseInt(orderResult.rows[0].max_order, 10) + 1

    const insertResult = await pool.query(
      `INSERT INTO modules (course_id, title, module_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [courseId, title, nextOrder]
    )

    return res.status(201).json(insertResult.rows[0])
  } catch (err) {
    console.error('createModule error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a module's title; only the instructor who owns the parent course may do this
export const updateModule = async (req, res) => {
  try {
    const { id } = req.params
    const { title } = req.body

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const moduleResult = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [id]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [moduleResult.rows[0].course_id]
    )

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Parent course not found' })
    }

    if (courseResult.rows[0].instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: you do not own this course' })
    }

    const updated = await pool.query(
      `UPDATE modules SET title = $1 WHERE id = $2 RETURNING *`,
      [title.trim(), id]
    )

    return res.status(200).json(updated.rows[0])
  } catch (err) {
    console.error('updateModule error:', err)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a module; the ON DELETE CASCADE in the schema automatically removes all lessons inside it
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params

    const moduleResult = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [id]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Module not found' })
    }

    const moduleRow = moduleResult.rows[0]

    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [moduleRow.course_id]
    )

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Parent course not found' })
    }

    const course = courseResult.rows[0]

    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: you do not own this course' })
    }

    await pool.query('DELETE FROM modules WHERE id = $1', [id])

    return res.status(204).send()
  } catch (error) {
    console.error('deleteModule error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
