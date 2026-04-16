import { Router } from 'express'
const router = Router()
router.get('/me',  (req, res) => res.json({ message: 'get me stub' }))
router.put('/me',  (req, res) => res.json({ message: 'update me stub' }))
export default router