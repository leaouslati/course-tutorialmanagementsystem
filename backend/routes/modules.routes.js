const express = require('express');
const router = express.Router();
const { createModule } = require('../controllers/modules.controller');
const authMiddleware = require('../middleware/auth.middleware');
const instructorOnly = require('../middleware/instructorOnly.middleware');

// POST /api/modules
router.post('/', authMiddleware, instructorOnly, createModule);

module.exports = router;