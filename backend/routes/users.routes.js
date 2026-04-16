import { Router } from 'express'
import { getMe, updateMe } from '../controllers/users.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)

export default router
