import { Router } from 'express'
import {
  getCourses,
  getStats,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courses.controller.js'

import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

// GET /api/courses — list all courses, supports ?category, ?difficulty, ?search, ?sortRating, ?sortTime  [no auth]
router.get('/', getCourses)

// GET /api/courses/stats — aggregate totals (course count, students, avg rating)  [no auth]
// Must be defined before /:id so Express does not treat "stats" as an id param
router.get('/stats', getStats)

// GET /api/courses/:id — single course with its modules and lessons  [no auth]
router.get('/:id', getCourseById)

// POST /api/courses — create a new course  [auth required, instructor only]
router.post('/', authMiddleware, instructorOnly, createCourse)

// PUT /api/courses/:id — update an existing course  [auth required, owner only]
router.put('/:id', authMiddleware, updateCourse)

// DELETE /api/courses/:id — remove a course and its content  [auth required, owner only]
router.delete('/:id', authMiddleware, deleteCourse)

export default router
