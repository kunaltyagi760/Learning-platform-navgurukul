const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  notes: { type: String },
  problems: [{
    _id: mongoose.Schema.Types.ObjectId,
    question: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);
