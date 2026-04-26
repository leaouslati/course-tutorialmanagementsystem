import swaggerJsdoc from 'swagger-jsdoc'

// Full OpenAPI 3.0 specification for the CourseHub API (22 endpoints across 6 route groups)
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CourseHub API',
      version: '1.0.0',
      description:
        'REST API for the CourseHub tutorial management system. ' +
        'Protected endpoints require a Bearer JWT in the Authorization header.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── Auth ─────────────────────────────────────────────────────────────
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name:     { type: 'string', example: 'Jane Smith' },
            email:    { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 8, example: 'secret123' },
            role:     { type: 'string', enum: ['student', 'instructor'], example: 'student' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user:  { $ref: '#/components/schemas/UserPublic' },
          },
        },
        CheckEmailRequest: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
          },
        },
        ResetPasswordRequest: {
          type: 'object',
          required: ['email', 'newPassword'],
          properties: {
            email:       { type: 'string', format: 'email', example: 'jane@example.com' },
            newPassword: { type: 'string', minLength: 8, example: 'newsecret123' },
          },
        },
        // ── Users ────────────────────────────────────────────────────────────
        UserPublic: {
          type: 'object',
          properties: {
            id:         { type: 'integer', example: 1 },
            name:       { type: 'string', example: 'Jane Smith' },
            email:      { type: 'string', format: 'email', example: 'jane@example.com' },
            role:       { type: 'string', enum: ['student', 'instructor'], example: 'student' },
            joinedDate: { type: 'string', format: 'date-time' },
          },
        },
        UpdateMeRequest: {
          type: 'object',
          properties: {
            name:            { type: 'string', example: 'Jane Doe' },
            email:           { type: 'string', format: 'email', example: 'jane.doe@example.com' },
            currentPassword: { type: 'string', example: 'oldpassword' },
            newPassword:     { type: 'string', minLength: 8, example: 'newpassword123' },
          },
        },
        // ── Courses ──────────────────────────────────────────────────────────
        Course: {
          type: 'object',
          properties: {
            id:               { type: 'integer', example: 1 },
            title:            { type: 'string', example: 'Complete JavaScript Bootcamp' },
            shortDescription: { type: 'string', example: 'Learn JS from scratch' },
            description:      { type: 'string', example: 'A comprehensive course...' },
            category:         { type: 'string', example: 'Programming' },
            difficulty:       { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
            duration:         { type: 'integer', example: 120 },
            rating:           { type: 'number', format: 'float', example: 4.5 },
            studentsCount:    { type: 'integer', example: 320 },
            image:            { type: 'string', format: 'uri', example: 'https://example.com/img.jpg' },
            instructorId:     { type: 'integer', example: 2 },
            instructorName:   { type: 'string', example: 'John Doe' },
            createdAt:        { type: 'string', format: 'date-time' },
          },
        },
        CourseWithModules: {
          allOf: [
            { $ref: '#/components/schemas/Course' },
            {
              type: 'object',
              properties: {
                modules: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ModuleWithLessons' },
                },
              },
            },
          ],
        },
        CourseWriteRequest: {
          type: 'object',
          required: ['title', 'shortDescription', 'description'],
          properties: {
            title:            { type: 'string', example: 'Complete JavaScript Bootcamp' },
            shortDescription: { type: 'string', example: 'Learn JS from scratch' },
            description:      { type: 'string', example: 'A comprehensive course...' },
            category:         { type: 'string', example: 'Programming' },
            difficulty:       { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
            duration:         { type: 'integer', example: 120 },
            rating:           { type: 'number', format: 'float', example: 4.5 },
            studentsCount:    { type: 'integer', example: 0 },
            image:            { type: 'string', format: 'uri', example: 'https://example.com/img.jpg' },
          },
        },
        CourseStats: {
          type: 'object',
          properties: {
            totalCourses:  { type: 'integer', example: 42 },
            totalStudents: { type: 'integer', example: 1250 },
            averageRating: { type: 'number', format: 'float', example: 4.3 },
          },
        },
        // ── Modules ──────────────────────────────────────────────────────────
        Module: {
          type: 'object',
          properties: {
            id:       { type: 'integer', example: 1 },
            courseId: { type: 'integer', example: 1 },
            title:    { type: 'string', example: 'Introduction to Variables' },
            order:    { type: 'integer', example: 1 },
          },
        },
        ModuleWithLessons: {
          allOf: [
            { $ref: '#/components/schemas/Module' },
            {
              type: 'object',
              properties: {
                lessons: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Lesson' },
                },
              },
            },
          ],
        },
        ModuleWriteRequest: {
          type: 'object',
          required: ['courseId', 'title'],
          properties: {
            courseId: { type: 'integer', example: 1 },
            title:    { type: 'string', example: 'Introduction to Variables' },
          },
        },
        // ── Lessons ──────────────────────────────────────────────────────────
        Lesson: {
          type: 'object',
          properties: {
            id:       { type: 'integer', example: 1 },
            moduleId: { type: 'integer', example: 1 },
            title:    { type: 'string', example: 'What is a Variable?' },
            content:  { type: 'string', example: 'A variable stores data...' },
            videoUrl: { type: 'string', format: 'uri', example: 'https://youtube.com/...' },
            duration: { type: 'integer', example: 10 },
            free:     { type: 'boolean', example: false },
            order:    { type: 'integer', example: 1 },
          },
        },
        LessonWriteRequest: {
          type: 'object',
          required: ['moduleId', 'title'],
          properties: {
            moduleId: { type: 'integer', example: 1 },
            title:    { type: 'string', example: 'What is a Variable?' },
            content:  { type: 'string', example: 'A variable stores data...' },
            videoUrl: { type: 'string', format: 'uri', example: 'https://youtube.com/...' },
            duration: { type: 'integer', example: 10 },
          },
        },
        // ── Enrollments ──────────────────────────────────────────────────────
        EnrollRequest: {
          type: 'object',
          required: ['courseId'],
          properties: {
            courseId: { type: 'integer', example: 1 },
          },
        },
        EnrollmentStatus: {
          type: 'object',
          properties: {
            enrolled: { type: 'boolean', example: true },
          },
        },
        ProgressRequest: {
          type: 'object',
          required: ['progress'],
          properties: {
            progress: { type: 'number', minimum: 0, maximum: 100, example: 75 },
          },
        },
        ProgressResponse: {
          type: 'object',
          properties: {
            progress: { type: 'number', example: 75 },
          },
        },
        // ── Shared ───────────────────────────────────────────────────────────
        MessageResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Descriptive error message' },
          },
        },
      },
    },

    // ── Paths ─────────────────────────────────────────────────────────────────
    paths: {

      // ── Health ──────────────────────────────────────────────────────────────
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Server health check',
          responses: {
            200: {
              description: 'Server is running',
              content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } },
            },
          },
        },
      },

      // ── Auth ────────────────────────────────────────────────────────────────
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new account',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
          },
          responses: {
            201: { description: 'Account created', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email already taken', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          },
        },
      },

      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Log in and receive a JWT',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          },
        },
      },

      '/api/auth/check-email': {
        post: {
          tags: ['Auth'],
          summary: 'Check whether an email belongs to an existing account',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CheckEmailRequest' } } },
          },
          responses: {
            200: { description: 'Email found', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
            404: { description: 'No account found', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          },
        },
      },

      '/api/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Update password from the reset modal (after check-email)',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
          },
          responses: {
            200: { description: 'Password updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
            404: { description: 'Email not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          },
        },
      },

      // ── Users ────────────────────────────────────────────────────────────────
      '/api/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get the logged-in user\'s profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPublic' } } } },
            401: { description: 'Missing or invalid token' },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update name, email, or password',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateMeRequest' } } },
          },
          responses: {
            200: { description: 'Updated profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserPublic' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Wrong current password or missing token' },
          },
        },
      },

      // ── Courses ──────────────────────────────────────────────────────────────
      '/api/courses': {
        get: {
          tags: ['Courses'],
          summary: 'List all courses (with optional filters)',
          parameters: [
            { name: 'search',     in: 'query', schema: { type: 'string' },  description: 'Full-text search on title and description' },
            { name: 'category',   in: 'query', schema: { type: 'string' },  description: 'Filter by category name' },
            { name: 'difficulty', in: 'query', schema: { type: 'string' },  description: 'Beginner | Intermediate | Advanced' },
            { name: 'sortRating', in: 'query', schema: { type: 'string' },  description: 'asc | desc' },
            { name: 'sortTime',   in: 'query', schema: { type: 'string' },  description: 'asc | desc (by duration)' },
            { name: 'instructorId', in: 'query', schema: { type: 'string' }, description: 'Filter by instructor id or "me"' },
          ],
          responses: {
            200: {
              description: 'Array of courses',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } },
            },
          },
        },
        post: {
          tags: ['Courses'],
          summary: 'Create a new course (instructor only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseWriteRequest' } } },
          },
          responses: {
            201: { description: 'Course created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
            400: { description: 'Validation error' },
            403: { description: 'Not an instructor' },
          },
        },
      },

      '/api/courses/stats': {
        get: {
          tags: ['Courses'],
          summary: 'Aggregate stats (total courses, students, avg rating)',
          responses: {
            200: { description: 'Stats object', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseStats' } } } },
          },
        },
      },

      '/api/courses/{id}': {
        get: {
          tags: ['Courses'],
          summary: 'Get a single course with its modules and lessons',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Course detail', content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseWithModules' } } } },
            404: { description: 'Course not found' },
          },
        },
        put: {
          tags: ['Courses'],
          summary: 'Update a course (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CourseWriteRequest' } } },
          },
          responses: {
            200: { description: 'Updated course', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } },
            403: { description: 'Not the course owner' },
            404: { description: 'Course not found' },
          },
        },
        delete: {
          tags: ['Courses'],
          summary: 'Delete a course and all its content (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Deleted successfully' },
            403: { description: 'Not the course owner' },
            404: { description: 'Course not found' },
          },
        },
      },

      // ── Modules ──────────────────────────────────────────────────────────────
      '/api/modules': {
        post: {
          tags: ['Modules'],
          summary: 'Add a new module to a course (instructor only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ModuleWriteRequest' } } },
          },
          responses: {
            201: { description: 'Module created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Module' } } } },
            400: { description: 'Validation error' },
            403: { description: 'Not an instructor or not the course owner' },
          },
        },
      },

      '/api/modules/{id}': {
        put: {
          tags: ['Modules'],
          summary: 'Update a module\'s title (instructor/owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: { title: { type: 'string', example: 'Advanced Concepts' } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Updated module', content: { 'application/json': { schema: { $ref: '#/components/schemas/Module' } } } },
            400: { description: 'title is required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            403: { description: 'Not the course owner' },
            404: { description: 'Module not found' },
          },
        },
        delete: {
          tags: ['Modules'],
          summary: 'Delete a module and all its lessons (instructor/owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Deleted successfully' },
            403: { description: 'Not the course owner' },
            404: { description: 'Module not found' },
          },
        },
      },

      // ── Lessons ──────────────────────────────────────────────────────────────
      '/api/lessons': {
        post: {
          tags: ['Lessons'],
          summary: 'Add a new lesson to a module (instructor only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonWriteRequest' } } },
          },
          responses: {
            201: { description: 'Lesson created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Lesson' } } } },
            400: { description: 'Validation error' },
            403: { description: 'Not the module owner' },
          },
        },
      },

      '/api/lessons/{id}': {
        put: {
          tags: ['Lessons'],
          summary: 'Update lesson fields — title, content, duration, videoUrl (instructor/owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LessonWriteRequest' } } },
          },
          responses: {
            200: { description: 'Updated lesson', content: { 'application/json': { schema: { $ref: '#/components/schemas/Lesson' } } } },
            400: { description: 'No fields provided or title empty', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            403: { description: 'Not the course owner' },
            404: { description: 'Lesson not found' },
          },
        },
        delete: {
          tags: ['Lessons'],
          summary: 'Delete a lesson (instructor/owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Deleted successfully' },
            403: { description: 'Not the lesson owner' },
            404: { description: 'Lesson not found' },
          },
        },
      },

      // ── Enrollments ──────────────────────────────────────────────────────────
      '/api/enrollments': {
        get: {
          tags: ['Enrollments'],
          summary: 'Get all courses the logged-in student is enrolled in',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of enrolled courses with progress',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } },
            },
          },
        },
        post: {
          tags: ['Enrollments'],
          summary: 'Enroll the logged-in student in a course',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/EnrollRequest' } } },
          },
          responses: {
            201: { description: 'Enrollment created' },
            400: { description: 'courseId missing' },
            403: { description: 'Instructors cannot enroll' },
            409: { description: 'Already enrolled' },
          },
        },
      },

      '/api/enrollments/{courseId}/status': {
        get: {
          tags: ['Enrollments'],
          summary: 'Check whether the logged-in user is enrolled in a course',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Enrollment status', content: { 'application/json': { schema: { $ref: '#/components/schemas/EnrollmentStatus' } } } },
          },
        },
      },

      '/api/enrollments/{courseId}': {
        delete: {
          tags: ['Enrollments'],
          summary: 'Unenroll the logged-in student from a course',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            204: { description: 'Unenrolled successfully' },
            404: { description: 'Enrollment not found' },
          },
        },
      },

      '/api/enrollments/{courseId}/progress': {
        put: {
          tags: ['Enrollments'],
          summary: 'Update the student\'s progress percentage for a course',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'courseId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ProgressRequest' } } },
          },
          responses: {
            200: { description: 'Updated progress', content: { 'application/json': { schema: { $ref: '#/components/schemas/ProgressResponse' } } } },
            400: { description: 'Invalid progress value' },
            404: { description: 'Enrollment not found' },
          },
        },
      },
    },
  },
  // All docs are defined inline above — no route files need to be scanned
  apis: [],
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
