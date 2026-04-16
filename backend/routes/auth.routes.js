import { Router } from 'express'
import { register, login, forgotPassword, checkEmail } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/check-email', checkEmail)
router.post('/forgot-password', forgotPassword)

export default router
