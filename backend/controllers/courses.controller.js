import pool from '../config/db.js';

const getCourses = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.name as instructor_name
       FROM courses c
       JOIN users u ON c.instructor_id = u.id`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getCourses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCourses,
};