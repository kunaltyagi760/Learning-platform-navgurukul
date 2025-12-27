const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');

const getProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user.userId;
    const progress = await Progress.findOne({ lessonId, studentId });
    if (!progress) return res.json({ studentId, lessonId, notesCompleted: false, solvedProblems: [], timeSpent: 0 });
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const markNotes = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;
    const studentId = req.user.userId;
    let progress = await Progress.findOne({ lessonId, studentId });
    
    if (!progress) {
      // If no progress record exists, create one with notes completed
      progress = await Progress.create({ studentId, lessonId, courseId, notesCompleted: true });
    } else {
      // Toggle the notesCompleted status
      progress.notesCompleted = !progress.notesCompleted;
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const markProblem = async (req, res) => {
  try {
    const { lessonId, courseId, problemId } = req.body;
    const studentId = req.user.userId;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    let progress = await Progress.findOne({ lessonId, studentId });
    if (!progress) {
      progress = await Progress.create({ studentId, lessonId, courseId, solvedProblems: [problemId] });
    } else {
      if (!progress.solvedProblems.map(String).includes(String(problemId))) {
        progress.solvedProblems.push(problemId);
        await progress.save();
      }
    }
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addTime = async (req, res) => {
  try {
    const { lessonId, courseId, delta } = req.body; // delta in seconds
    const studentId = req.user.userId;
    if (!lessonId || typeof delta !== 'number') return res.status(400).json({ message: 'Invalid payload' });
    let progress = await Progress.findOne({ lessonId, studentId });
    if (!progress) {
      progress = await Progress.create({ studentId, lessonId, courseId, timeSpent: Math.max(0, delta) });
    } else {
      progress.timeSpent = Math.max(0, (progress.timeSpent || 0) + delta);
      await progress.save();
    }
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProgress, markNotes, markProblem, addTime };
