import { Router } from 'express'
const router = Router()
router.get('/',                    (req, res) => res.json({ message: 'get enrollments stub' }))
router.post('/',                   (req, res) => res.json({ message: 'enroll stub' }))
router.delete('/:courseId',        (req, res) => res.json({ message: 'unenroll stub' }))
router.put('/:courseId/progress',  (req, res) => res.json({ message: 'progress stub' }))
export default router