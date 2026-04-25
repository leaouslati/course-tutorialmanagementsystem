import { Router } from 'express'
<<<<<<< HEAD
import { getMyEnrollments, getEnrollmentStatus, enroll, unenroll, updateProgress } from '../controllers/enrollments.controller.js'
=======
import { getMyEnrollments, enroll, unenroll, updateProgress, getEnrollmentStatus } from '../controllers/enrollments.controller.js'
>>>>>>> e804b8a460d75f42022bde07c401a6723dacd6d3
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

<<<<<<< HEAD
router.get('/',                    authMiddleware, getMyEnrollments)
// /status route before /:courseId to avoid param conflict
router.get('/:courseId/status',    authMiddleware, getEnrollmentStatus)
router.post('/',                   authMiddleware, enroll)
router.delete('/:courseId',        authMiddleware, unenroll)
router.put('/:courseId/progress',  authMiddleware, updateProgress)
=======
router.get('/',                      authMiddleware, getMyEnrollments)
router.post('/',                     authMiddleware, enroll)
router.get('/:courseId/status',      authMiddleware, getEnrollmentStatus)
router.delete('/:courseId',          authMiddleware, unenroll)
router.put('/:courseId/progress',    authMiddleware, updateProgress)
>>>>>>> e804b8a460d75f42022bde07c401a6723dacd6d3

export default router