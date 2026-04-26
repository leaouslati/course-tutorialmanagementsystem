import { Router } from 'express'
import { createModule, updateModule, deleteModule } from '../controllers/modules.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

// POST /api/modules — add a new module to a course  [auth required, instructor only]
router.post('/', authMiddleware, instructorOnly, createModule)

// PUT /api/modules/:id — update a module's title  [auth required, instructor only]
router.put('/:id', authMiddleware, instructorOnly, updateModule)

// DELETE /api/modules/:id — remove a module and all its lessons (cascade)  [auth required, instructor only]
router.delete('/:id', authMiddleware, instructorOnly, deleteModule)

export default router
