import { Router } from 'express'
import { createCourse, updateCourse, deleteCourse, getCourses, getCourseById } from '../controllers/courses.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', getCourses)
router.get('/:id', getCourseById)
router.post('/', authMiddleware, createCourse)
router.put('/:id', authMiddleware, updateCourse)
router.delete('/:id', authMiddleware, deleteCourse)

export default router
