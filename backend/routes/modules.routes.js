import { Router } from 'express'
import { createModule, deleteModule } from '../controllers/modules.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { instructorOnly } from '../middleware/instructorOnly.middleware.js'

const router = Router()

router.post('/', authMiddleware, instructorOnly, createModule)
router.delete('/:id', authMiddleware, instructorOnly, deleteModule)

export default router