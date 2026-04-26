// instructorOnly.middleware.js
// Runs after authMiddleware on routes that only instructors may access
// (e.g. creating/editing/deleting courses, modules, and lessons).
// Reads req.user.role (set by authMiddleware) and responds 403 if the
// caller is not an instructor.

// Allow the request to proceed only if the authenticated user is an instructor
export const instructorOnly = (req, res, next) => {
  if (req.user?.role !== 'instructor') {
    return res.status(403).json({ message: 'Only instructors can do this' })
  }
  next()
}
