import { Router } from 'express'
import { createLesson, updateLesson, deleteLesson } from '../controllers/lessons.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

// POST /api/lessons — add a new lesson to a module  [auth required, instructor only]
router.post('/', authMiddleware, instructorOnly, createLesson)

// PUT /api/lessons/:id — update lesson fields (title, content, duration, videoUrl)  [auth required, instructor only]
router.put('/:id', authMiddleware, instructorOnly, updateLesson)

// DELETE /api/lessons/:id — remove a lesson  [auth required, instructor only]
router.delete('/:id', authMiddleware, instructorOnly, deleteLesson)

export default router
