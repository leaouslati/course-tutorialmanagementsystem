import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorMiddleware } from './middleware/error.middleware.js'
import { loggerMiddleware } from './middleware/logger.middleware.js'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/courses.routes.js'
import enrollmentRoutes from './routes/enrollments.routes.js'
import userRoutes from './routes/users.routes.js'

dotenv.config()
const app = express()

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(loggerMiddleware)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/users', userRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))