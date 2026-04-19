import { Router } from 'express'
import { getCourses } from '../controllers/courses.controller.js'

const router = Router()
router.get('/', getCourses)
router.get('/:id',    (req, res) => res.json({ message: 'get one course stub' }))
router.post('/',      (req, res) => res.json({ message: 'create course stub' }))
router.put('/:id',    (req, res) => res.json({ message: 'update course stub' }))
router.delete('/:id', (req, res) => res.json({ message: 'delete course stub' }))
export default router