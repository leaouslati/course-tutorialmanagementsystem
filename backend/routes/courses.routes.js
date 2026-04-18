import { Router } from 'express'
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.controller.js'

import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', getCourses)
router.get('/:id', getCourseById)

router.post('/', authMiddleware, createCourse)
router.put('/:id', authMiddleware, updateCourse)
router.delete('/:id', authMiddleware, deleteCourse)

export default router