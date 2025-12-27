const express = require('express');
const router = express.Router();
const { getProgress, markNotes, markProblem, addTime } = require('../controllers/progress.controller');
const auth = require('../middleware/auth.middleware');

// POST routes must come before GET /:lessonId
router.post('/notes', auth, markNotes);
router.post('/problem', auth, markProblem);
router.post('/time', auth, addTime);
router.get('/:lessonId', auth, getProgress);

module.exports = router;
