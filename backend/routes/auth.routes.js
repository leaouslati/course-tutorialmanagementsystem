import express from 'express'
import { register, login, checkEmail, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router()

// POST /api/auth/register — create a new account and return a JWT  [no auth]
router.post('/register', register)

// POST /api/auth/login — verify credentials and return a JWT  [no auth]
router.post('/login', login)

// POST /api/auth/check-email — confirm an email exists before allowing reset  [no auth]
router.post('/check-email', checkEmail)

// POST /api/auth/reset-password — update password using email + new password  [no auth]
router.post('/reset-password', resetPassword)

export default router
