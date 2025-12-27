const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  notesCompleted: { type: Boolean, default: false },
  solvedProblems: [mongoose.Schema.Types.ObjectId],
  timeSpent: { type: Number, default: 0 },
}, { timestamps: true });

ProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', ProgressSchema);
