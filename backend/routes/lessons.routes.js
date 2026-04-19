import { Router } from 'express'
import { createLesson } from '../controllers/lessons.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

router.post('/', authMiddleware, instructorOnly, createLesson)

export default router