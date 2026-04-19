import { Router } from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getMyEnrollments, enroll, unenroll, updateProgress } from '../controllers/enrollments.controller.js'

const router = Router()

router.get('/',                   authMiddleware, getMyEnrollments)
router.post('/',                  authMiddleware, enroll)
router.delete('/:courseId',       authMiddleware, unenroll)
router.put('/:courseId/progress', authMiddleware, updateProgress)

export default router