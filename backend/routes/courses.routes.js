import { Router } from 'express'
const router = Router()
router.get('/',       (req, res) => res.json({ message: 'get all courses stub' }))
router.get('/:id',    (req, res) => res.json({ message: 'get one course stub' }))
router.post('/',      (req, res) => res.json({ message: 'create course stub' }))
router.put('/:id',    (req, res) => res.json({ message: 'update course stub' }))
router.delete('/:id', (req, res) => res.json({ message: 'delete course stub' }))
export default router