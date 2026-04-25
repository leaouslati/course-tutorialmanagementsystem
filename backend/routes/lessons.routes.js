import { Router } from 'express'
import { createLesson, deleteLesson } from '../controllers/lessons.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

router.post('/', authMiddleware, instructorOnly, createLesson)
router.delete('/:id', authMiddleware, instructorOnly, deleteLesson)

export default router