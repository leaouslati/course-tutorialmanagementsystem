import { Router } from 'express'
import { getMe, updateMe } from '../controllers/users.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/users/me — return the logged-in user's profile  [auth required]
router.get('/me', authMiddleware, getMe)

// PUT /api/users/me — update name, email, or password  [auth required]
router.put('/me', authMiddleware, updateMe)

export default router
