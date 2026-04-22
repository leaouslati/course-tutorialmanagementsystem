import { Router } from 'express'
import {
  getCourses,
  getStats,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.controller.js'

import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

router.get('/', getCourses)
// /stats must be before /:id so Express doesn't treat "stats" as an id param
router.get('/stats', getStats)
router.get('/:id', getCourseById)

router.post('/', authMiddleware, instructorOnly, createCourse)
router.put('/:id', authMiddleware, updateCourse)
router.delete('/:id', authMiddleware, deleteCourse)

export default router
