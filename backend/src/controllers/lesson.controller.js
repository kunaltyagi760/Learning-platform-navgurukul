const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

const getLessonsByCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const lessons = await Lesson.find({ courseId });
    res.json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findById(id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createLesson = async (req, res) => {
  try {
    const { courseId, title, notes, problems } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.instructorId.toString() !== req.user.userId) return res.status(403).json({ message: 'Not allowed' });
    const lesson = await Lesson.create({ courseId, title, notes, problems });
    course.lessons.push(lesson._id);
    await course.save();
    res.status(201).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getLessonsByCourse, createLesson, getLessonById };
