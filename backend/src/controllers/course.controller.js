const Course = require('../models/Course');

const getAll = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const create = async (req, res) => {
  try {
    const { title, subtitle } = req.body;
    const course = await Course.create({
      title,
      subtitle,
      instructorId: req.user.userId,
      lessons: []
    });
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle } = req.body;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId.toString() !== req.user.userId) return res.status(403).json({ message: 'Not allowed' });
    if (title) course.title = title;
    if (subtitle) course.subtitle = subtitle;
    await course.save();
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAll, create, update };
