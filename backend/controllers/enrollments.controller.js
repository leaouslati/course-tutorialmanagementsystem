import pool from '../config/db.js';

// getMyEnrollments
const getMyEnrollments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, c.title, c.short_description, c.image_url, c.rating, c.students_count
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id = $1`,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getMyEnrollments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// enroll
const enroll = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const result = await pool.query(
      `INSERT INTO enrollments (user_id, course_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, course_id) DO NOTHING
       RETURNING *`,
      [req.user.id, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ message: 'Already enrolled' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('enroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// unenroll
const unenroll = async (req, res) => {
  try {
    const { courseId } = req.params;

    const result = await pool.query(
      'DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2',
      [req.user.id, courseId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('unenroll error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// updateProgress
const updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be a number between 0 and 100.' });
    }

    const result = await pool.query(
      `UPDATE enrollments
       SET progress = $1
       WHERE user_id = $2 AND course_id = $3
       RETURNING *`,
      [progress, req.user.id, courseId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getMyEnrollments, enroll, unenroll, updateProgress };