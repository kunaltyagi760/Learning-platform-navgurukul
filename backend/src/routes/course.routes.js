const express = require('express');
const router = express.Router();
const { getAll, create, update } = require('../controllers/course.controller');
const auth = require('../middleware/auth.middleware');
const { instructorOnly } = require('../middleware/role.middleware');

router.get('/', getAll);
router.post('/', auth, instructorOnly, create);
router.put('/:id', auth, instructorOnly, update);

module.exports = router;
