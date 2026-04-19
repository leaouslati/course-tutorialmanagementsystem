import { Router } from 'express'
import { getMyEnrollments, enroll, unenroll, updateProgress } from '../controllers/enrollments.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/',                   authMiddleware, getMyEnrollments)
router.post('/',                  authMiddleware, enroll)
router.delete('/:courseId',       authMiddleware, unenroll)
router.put('/:courseId/progress', authMiddleware, updateProgress)

export default router
