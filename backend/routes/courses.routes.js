import { Router } from 'express'
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getStats,
} from '../controllers/courses.controller.js'

import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

router.get('/', getCourses)
router.get('/stats', getStats)
router.get('/:id', getCourseById)

router.post('/', authMiddleware, instructorOnly, createCourse)
router.put('/:id', authMiddleware, updateCourse)
router.delete('/:id', authMiddleware, deleteCourse)

export default router