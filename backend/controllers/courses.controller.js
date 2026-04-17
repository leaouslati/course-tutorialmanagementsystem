import db from "../config/db.js";

const ALLOWED_CATEGORIES = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI",
  "Cybersecurity",
  "Design",
  "Business",
  "Marketing",
  "General",
];

const ALLOWED_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const getAllCourses = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM courses
      ORDER BY id DESC
      `
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const courseResult = await db.query(
      `
      SELECT c.*, u.name AS instructor_name
      FROM courses c
      LEFT JOIN users u ON u.id = c.instructor_id
      WHERE c.id = $1
      `,
      [id]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    const course = courseResult.rows[0];

    const modulesResult = await db.query(
      `
      SELECT *
      FROM modules
      WHERE course_id = $1
      ORDER BY id ASC
      `,
      [id]
    );

    const modulesWithLessons = await Promise.all(
      modulesResult.rows.map(async (module) => {
        const lessonsResult = await db.query(
          `
          SELECT *
          FROM lessons
          WHERE module_id = $1
          ORDER BY id ASC
          `,
          [module.id]
        );

        return {
          ...module,
          lessons: lessonsResult.rows,
        };
      })
    );

    return res.json({
      ...course,
      modules: modulesWithLessons,
    });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const {
      title,
      description,
      category,
      difficulty,
      image,
      duration,
      short_description,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!category || !ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    if (!difficulty || !ALLOWED_DIFFICULTIES.includes(difficulty)) {
      return res.status(400).json({
        message: "Difficulty must be Beginner, Intermediate, or Advanced",
      });
    }

    const result = await db.query(
      `
      INSERT INTO courses (
        title,
        description,
        short_description,
        category,
        difficulty,
        image,
        duration,
        instructor_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [
        title.trim(),
        description.trim(),
        short_description ?? null,
        category,
        difficulty,
        image ?? null,
        duration ?? null,
        instructorId,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createCourse error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateCourse = async (req, res) => {
  return res.status(501).json({ message: "updateCourse not implemented yet" });
};

export const deleteCourse = async (req, res) => {
  return res.status(501).json({ message: "deleteCourse not implemented yet" });
};