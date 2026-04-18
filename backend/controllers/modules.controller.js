const pool = require('../config/db');

const createModule = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    // Validate required fields
    if (!courseId || !title) {
      return res.status(400).json({ error: 'courseId and title are required' });
    }

    // Find the course
    const courseResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Check ownership
    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: you do not own this course' });
    }

    // Get current max module_order for this course
    const orderResult = await pool.query(
      'SELECT COALESCE(MAX(module_order), 0) AS max_order FROM modules WHERE course_id = $1',
      [courseId]
    );

    const nextOrder = orderResult.rows[0].max_order + 1;

    // Insert the new module
    const insertResult = await pool.query(
      `INSERT INTO modules (course_id, title, module_order)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [courseId, title, nextOrder]
    );

    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error('createModule error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createModule };