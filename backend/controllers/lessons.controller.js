import pool from '../config/db.js'

// Add a new lesson to a module; appends it at the end using max lesson_order + 1
export const createLesson = async (req, res) => {
  try {
    const { moduleId, title, content, duration, videoUrl } = req.body

    if (!moduleId) {
      return res.status(400).json({ error: 'moduleId is required' })
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'title is required' })
    }

    const moduleResult = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [moduleId]
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
      return res.status(403).json({ message: 'You do not own this course.' })
    }

    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(lesson_order), 0) AS max_order FROM lessons WHERE module_id = $1',
      [moduleId]
    )

    const nextOrder = Number(orderResult.rows[0].max_order) + 1

    const insertResult = await pool.query(
      `INSERT INTO lessons (module_id, title, content, duration, video_url, lesson_order)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        moduleId,
        title.trim(),
        content ?? null,
        duration ?? null,
        videoUrl ?? null,
        nextOrder,
      ]
    )

    const lesson = insertResult.rows[0]

    return res.status(201).json({
      id: lesson.id,
      moduleId: lesson.module_id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration,
      videoUrl: lesson.video_url,
      lessonOrder: lesson.lesson_order,
    })
  } catch (error) {
    console.error('createLesson error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Update one or more lesson fields; only the instructor who owns the parent course may do this
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, duration, videoUrl } = req.body

    const hasField = [title, content, duration, videoUrl].some((v) => v !== undefined)
    if (!hasField) {
      return res.status(400).json({ error: 'Request body must include at least one field to update' })
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: 'title cannot be empty' })
    }

    const lessonResult = await pool.query('SELECT * FROM lessons WHERE id = $1', [id])

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    const moduleResult = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [lessonResult.rows[0].module_id]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Parent module not found' })
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
      `UPDATE lessons
          SET title     = COALESCE($1, title),
              content   = COALESCE($2, content),
              duration  = COALESCE($3, duration),
              video_url = COALESCE($4, video_url)
        WHERE id = $5
        RETURNING *`,
      [title?.trim() ?? null, content ?? null, duration ?? null, videoUrl ?? null, id]
    )

    const row = updated.rows[0]
    return res.status(200).json({
      id: row.id,
      moduleId: row.module_id,
      title: row.title,
      content: row.content,
      duration: row.duration,
      videoUrl: row.video_url,
      lessonOrder: row.lesson_order,
    })
  } catch (error) {
    console.error('updateLesson error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// Delete a lesson; walks up lesson → module → course to verify the caller owns the course
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params

    const lessonResult = await pool.query(
      'SELECT * FROM lessons WHERE id = $1',
      [id]
    )

    if (lessonResult.rows.length === 0) {
      return res.status(404).json({ message: 'Lesson not found' })
    }

    const lesson = lessonResult.rows[0]

    const moduleResult = await pool.query(
      'SELECT * FROM modules WHERE id = $1',
      [lesson.module_id]
    )

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Parent module not found' })
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

    await pool.query('DELETE FROM lessons WHERE id = $1', [id])

    return res.status(204).send()
  } catch (error) {
    console.error('deleteLesson error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
