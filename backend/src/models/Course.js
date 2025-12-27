const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
