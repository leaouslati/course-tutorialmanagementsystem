// TODO: implement
// createCourse
const createCourse = async (req, res) => {
  try {
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Access denied. Instructors only.' });
    }

    const { title, shortDescription, description, category, difficulty, duration, imageUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const result = await pool.query(
      `INSERT INTO courses (title, short_description, description, category, difficulty, duration, image_url, instructor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, shortDescription, description, category, difficulty, duration, imageUrl, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('createCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};