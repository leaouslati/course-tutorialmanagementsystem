import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import { loggerMiddleware } from './middleware/logger.middleware.js'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/courses.routes.js'
import enrollmentRoutes from './routes/enrollments.routes.js'
import userRoutes from './routes/users.routes.js'
import lessonRoutes from './routes/lessons.routes.js'
import moduleRoutes from './routes/modules.routes.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://course-tutorialmanagementsystem.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))
app.use(express.json())
app.use(loggerMiddleware)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Interactive API docs — visit http://localhost:3000/api/docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/modules', moduleRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
