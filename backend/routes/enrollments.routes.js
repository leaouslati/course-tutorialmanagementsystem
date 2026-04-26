import { Router } from 'express'
import { getMyEnrollments, getEnrollmentStatus, enroll, unenroll, updateProgress } from '../controllers/enrollments.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/enrollments — list all courses the logged-in student is enrolled in  [auth required]
router.get('/',                    authMiddleware, getMyEnrollments)

// GET /api/enrollments/:courseId/status — check if the logged-in user is enrolled in a course  [auth required]
router.get('/:courseId/status',    authMiddleware, getEnrollmentStatus)

// POST /api/enrollments — enroll the logged-in student in a course  [auth required, students only]
router.post('/',                   authMiddleware, enroll)

// DELETE /api/enrollments/:courseId — remove the logged-in student's enrollment  [auth required]
router.delete('/:courseId',        authMiddleware, unenroll)

// PUT /api/enrollments/:courseId/progress — update progress percentage (0–100)  [auth required]
router.put('/:courseId/progress',  authMiddleware, updateProgress)

export default router