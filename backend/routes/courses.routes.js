//courses.routes.js
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { instructorOnly } from "../middleware/instructorOnly.middleware.js";

const router = Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post("/", authMiddleware, instructorOnly, createCourse);
router.put("/:id", authMiddleware, instructorOnly, updateCourse);
router.delete("/:id", authMiddleware, instructorOnly, deleteCourse);

export default router;