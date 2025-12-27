# Learning Platform Backend

Node.js + Express backend for the Progressive Student Dashboard.

## Overview

A production-ready REST API built with Express.js and MongoDB for managing courses, lessons, student progress, and time tracking. Uses JWT authentication with role-based access control (students vs instructors).

## Features

- ✅ **Authentication**: JWT-based login/signup with secure password hashing (bcrypt)
- 📚 **Course Management**: Create, read, update courses (instructors only)
- 📖 **Lesson Management**: Create lessons with notes and multiple problems
- 📊 **Progress Tracking**: Track student notes completion, problem solving, and time spent
- ⏱️ **Time Tracking**: Accurate per-student per-lesson time accumulation
- 🔐 **Authorization**: Role-based middleware for instructor-only endpoints
- 📝 **Seed Data**: Pre-populated with 1 instructor, 2 students, 1 course, 2 lessons

## Tech Stack

- **Node.js** — Runtime
- **Express.js** — Web framework
- **MongoDB** — NoSQL database
- **Mongoose** — ODM
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **CORS** — Cross-origin requests
- **Morgan** — HTTP logging

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   └── env.js         # Environment variables
│   ├── models/
│   │   ├── User.js        # User schema (student/instructor)
│   │   ├── Course.js      # Course schema
│   │   ├── Lesson.js      # Lesson schema with problems
│   │   └── Progress.js    # Student progress schema
│   ├── controllers/
│   │   ├── auth.controller.js       # Login/Signup logic
│   │   ├── course.controller.js     # Course CRUD
│   │   ├── lesson.controller.js     # Lesson CRUD
│   │   └── progress.controller.js   # Progress tracking
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── course.routes.js
│   │   ├── lesson.routes.js
│   │   └── progress.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification
│   │   └── role.middleware.js       # Instructor-only checks
│   ├── seed/
│   │   └── seedData.js              # Initialize demo data
│   ├── app.js                       # Express app setup
│   └── server.js                    # Server entry point
├── package.json
└── README.md
```

## Setup & Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up MongoDB

Ensure MongoDB is running locally:

```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. Configure Environment

Create `.env` file in `backend/` directory:

```bash
PORT=5000
DB_URI=mongodb://127.0.0.1:27017/learning_platform
JWT_SECRET=your_super_secret_key_change_in_production
```

### 4. Seed Initial Data

Populate with demo users and courses:

```bash
npm run seed
```

This creates:
- **Instructor**: `alice@teach.com` (password: `password`)
- **Students**: `bob@student.com`, `carol@student.com` (password: `password`)
- **Course**: "Intro to Algorithms" with 2 lessons

### 5. Start Server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication

```
POST   /api/auth/signup
POST   /api/auth/login
```

### Courses

```
GET    /api/courses                  # Public: list all courses
POST   /api/courses                  # Instructor only: create course
PUT    /api/courses/:id              # Instructor (owner): update course
```

### Lessons

```
GET    /api/courses/:id/lessons      # Auth required: list lessons by course
GET    /api/lessons/:id              # Auth required: get single lesson
POST   /api/lessons                  # Instructor only: create lesson
```

### Progress (Student-specific)

```
GET    /api/progress/:lessonId       # Get student's progress for lesson
POST   /api/progress/notes           # Mark notes as complete/incomplete
POST   /api/progress/problem         # Mark a problem as solved
POST   /api/progress/time            # Add time spent (delta in seconds)
```

## Data Models

### User

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "instructor",
  createdAt: Date,
  updatedAt: Date
}
```

### Course

```javascript
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  instructorId: ObjectId (ref: User),
  lessons: [ObjectId] (ref: Lesson),
  createdAt: Date,
  updatedAt: Date
}
```

### Lesson

```javascript
{
  _id: ObjectId,
  courseId: ObjectId (ref: Course),
  title: String,
  notes: String,
  problems: [
    { _id: ObjectId, question: String }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Progress

```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  lessonId: ObjectId (ref: Lesson),
  notesCompleted: Boolean,
  solvedProblems: [ObjectId],
  timeSpent: Number (seconds),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication & Authorization

### JWT Payload

```javascript
{
  userId: "user_id",
  role: "student" | "instructor",
  iat: timestamp,
  exp: timestamp
}
```

### Middleware

**`authMiddleware`**: Verifies JWT from `Authorization: Bearer <token>` header. Attaches `req.user = { userId, role }`.

**`instructorOnly`**: Checks `req.user.role === 'instructor'`. Returns 403 if not instructor.

### Authorization Rules

- **Public**: `GET /api/courses`
- **Auth Required**: All lesson, progress endpoints
- **Instructor Only**: Create/Update courses, create lessons
- **Owner Only**: Edit own courses

## Time Tracking

1. Frontend starts timer when lesson page mounts
2. On unmount, calculates elapsed time (`delta` in seconds)
3. POSTs `{ lessonId, courseId, delta }` to `/api/progress/time`
4. Backend accumulates: `timeSpent += delta`
5. Data persists in MongoDB

## Error Handling

All endpoints return consistent error responses:

```javascript
{ message: "Error description" }
```

Common status codes:
- `200` — Success
- `201` — Created
- `400` — Bad request
- `401` — Unauthorized (no/invalid token)
- `403` — Forbidden (not enough permissions)
- `404` — Not found
- `500` — Server error

## Logging

Uses **Morgan** middleware to log all HTTP requests in `dev` format.

## Testing / Manual API Calls

Use Postman, curl, or the frontend:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'

# List courses (public)
curl http://localhost:5000/api/courses

# Get lessons (with token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/courses/COURSE_ID/lessons
```

## Deployment Notes

For production:
- Use environment variables for `JWT_SECRET`, `DB_URI`, `PORT`
- Set `NODE_ENV=production`
- Use MongoDB Atlas (cloud) instead of local MongoDB
- Enable HTTPS
- Consider rate limiting and input validation
- Add logging service (e.g., Winston, Sentry)

## Code Quality

- **MVC Architecture**: Models, Controllers, Routes separated
- **No Business Logic in Routes**: All logic in controllers
- **Proper Error Handling**: Try-catch with meaningful messages
- **Clean Variable Names**: Descriptive names for models and methods
- **Authorization on Backend**: Never rely on frontend auth checks alone
- **Password Security**: bcryptjs with salt rounds

---

See `/frontend/README.md` for frontend setup and usage instructions.

