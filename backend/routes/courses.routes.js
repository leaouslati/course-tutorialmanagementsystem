import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courses.controller.js'

const router = express.Router()

router.get('/', getCourses)
router.get('/:id', getCourse)

router.post('/', authMiddleware, createCourse)
router.put('/:id', authMiddleware, updateCourse)
router.delete('/:id', authMiddleware, deleteCourse)

export default router