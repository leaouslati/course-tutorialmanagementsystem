import express from 'express'
import { register, login, forgotPassword, checkEmail, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/check-email', checkEmail)

// NEW RESET PASSWORD ROUTE
router.post('/reset-password', resetPassword)

export default router