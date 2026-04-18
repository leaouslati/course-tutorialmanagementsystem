import express from 'express'
import { register, login, forgotPassword, checkEmail } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/check-email', checkEmail)

export default router