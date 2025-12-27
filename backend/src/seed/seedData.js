require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/learning_platform';

const run = async () => {
  try {
    await mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected for seeding');

    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});

    const instructor = await User.create({ name: 'Alice Instructor', email: 'alice@teach.com', password: 'password', role: 'instructor' });
    const student1 = await User.create({ name: 'Bob Student', email: 'bob@student.com', password: 'password', role: 'student' });
    const student2 = await User.create({ name: 'Carol Student', email: 'carol@student.com', password: 'password', role: 'student' });

    const course = await Course.create({ title: 'Intro to Algorithms', subtitle: 'Basics and problem solving', instructorId: instructor._id });

    const lesson1 = await Lesson.create({ courseId: course._id, title: 'Lesson 1: Complexity', notes: 'Study Big-O', problems: [{ question: 'What is O(n)?' }, { question: 'What is O(log n)?' }] });
    const lesson2 = await Lesson.create({ courseId: course._id, title: 'Lesson 2: Sorting', notes: 'Compare sorts', problems: [{ question: 'Implement bubble sort' }, { question: 'Why merge sort is O(n log n)?' }] });

    course.lessons.push(lesson1._id, lesson2._id);
    await course.save();

    console.log('Seeding complete');
    console.log('Instructor:', instructor.email, 'password: password');
    console.log('Students:', student1.email, student2.email, 'password: password');
    process.exit(0);
  } catch (err) {
    console.error('Seed error', err);
    process.exit(1);
  }
};

run();
