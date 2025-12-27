const express = require('express');
const router = express.Router();
const { getLessonsByCourse, createLesson, getLessonById } = require('../controllers/lesson.controller');
const auth = require('../middleware/auth.middleware');
const { instructorOnly } = require('../middleware/role.middleware');

router.get('/courses/:id/lessons', auth, getLessonsByCourse);
router.get('/lessons/:id', auth, getLessonById);
router.post('/', auth, instructorOnly, createLesson);

module.exports = router;
