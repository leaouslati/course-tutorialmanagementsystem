import { Router } from 'express'
import { getMyEnrollments, enroll } from '../controllers/enrollments.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',  authMiddleware, getMyEnrollments)
router.post('/', authMiddleware, enroll)

// stubs preserved for future implementation
router.delete('/:courseId',       (req, res) => res.status(501).json({ message: 'Not implemented' }))
router.put('/:courseId/progress', (req, res) => res.status(501).json({ message: 'Not implemented' }))

export default router
