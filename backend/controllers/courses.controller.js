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
// updateCourse
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = courseResult.rows[0];
    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course.' });
    }

    const { title, shortDescription, description, category, difficulty, duration, imageUrl } = req.body;

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
      [title, shortDescription, description, category, difficulty, duration, imageUrl, id]
    );

    res.status(200).json(updated.rows[0]);
  } catch (error) {
    console.error('updateCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// deleteCourse
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const course = courseResult.rows[0];
    if (course.instructor_id !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this course.' });
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [id]);

    res.status(204).send();
  } catch (error) {
    console.error('deleteCourse error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};