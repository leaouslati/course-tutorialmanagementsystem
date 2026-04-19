// TODO: implement
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

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('updateProgress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = {
  getMyEnrollments,  
  enroll,             
  unenroll,           
  updateProgress,     
};