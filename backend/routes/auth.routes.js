import { Router } from 'express'
const router = Router()
router.post('/register', (req, res) => res.json({ message: 'register stub' }))
router.post('/login',    (req, res) => res.json({ message: 'login stub' }))
export default router