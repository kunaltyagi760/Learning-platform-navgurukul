# Learning Platform — Progressive Student Dashboard

A production-ready full-stack learning progress tracking application built with **Node.js + Express + MongoDB** backend and **React + Chakra UI** frontend.

## Project Overview

This is an **interview-ready**, scalable learning management system where:

- **Students** can browse courses, view lessons with notes, solve problems, track progress, and monitor time spent per lesson.
- **Instructors** can create and edit their own courses, add lessons with notes and multiple problems.

Features accurate progress tracking, real-time timer with unmount persistence, role-based access control, and clean architecture.

## 🎯 Key Features

✅ **Authentication & Authorization**
- JWT-based login/signup with secure password hashing
- Role-based access control (student vs instructor)
- Protected routes on frontend & backend

✅ **Course & Lesson Management**
- Public course browsing
- Instructor course creation
- Lessons with notes and problems
- One-to-many course-to-lessons relationship

✅ **Student Progress Tracking**
- Mark notes as complete
- Track solved problems
- Visual progress indicators
- Real-time timer per lesson

✅ **Time Tracking**
- Automatic timer on lesson pages
- Persistent storage (saved on page unmount)
- Accurate per-student per-lesson accumulation
- Displayed with h/m/s formatting

✅ **Modern UI**
- Chakra UI components
- Fully responsive (mobile/tablet/desktop)
- Clean, professional design
- Loading states and error handling

✅ **Clean Architecture**
- MVC backend (Models, Controllers, Routes)
- Service-based API layer (Axios)
- Context API for state management (Auth)
- Reusable components
- Proper error handling

## 📁 Project Structure

```
Learning-platform-navgurukul/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth & role checks
│   │   ├── seed/            # Demo data
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Header, CourseCard, ProtectedRoute)
│   │   ├── pages/           # Page components (Dashboard, Login, Lesson, etc.)
│   │   ├── services/        # Axios API client
│   │   ├── context/         # AuthContext state
│   │   ├── theme/           # Chakra theme
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+
- **MongoDB** (local or Docker)

### Backend Setup

```bash
cd backend
npm install

# Create .env
echo "PORT=5000
DB_URI=mongodb://127.0.0.1:27017/learning_platform
JWT_SECRET=your_secret_key" > .env

# Seed demo data
npm run seed

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env
echo "VITE_API_BASE=http://localhost:5000/api" > .env

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000` (or next available port)

## 🔐 Test Credentials

After seeding backend, use these to test:

**Instructor:**
- Email: `alice@teach.com`
- Password: `password`

**Students:**
- Email: `bob@student.com` | `carol@student.com`
- Password: `password`

## 📚 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcryptjs
- **Middleware**: CORS, Morgan (logging)
- **Architecture**: MVC (Models, Controllers, Routes)

### Frontend
- **Bundler**: Vite
- **Framework**: React 18
- **Styling**: Chakra UI
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT interceptor
- **State Management**: React Context (Auth)

## 🔌 API Overview

### Authentication
```
POST   /api/auth/signup          # Create account
POST   /api/auth/login           # Login (returns JWT)
```

### Courses
```
GET    /api/courses              # List all (public)
POST   /api/courses              # Create (instructor only)
PUT    /api/courses/:id          # Update (owner instructor)
```

### Lessons
```
GET    /api/courses/:id/lessons  # List by course
GET    /api/lessons/:id          # Get single lesson
POST   /api/lessons              # Create (instructor only)
```

### Progress
```
GET    /api/progress/:lessonId       # Get student progress
POST   /api/progress/notes           # Mark notes complete
POST   /api/progress/problem         # Mark problem solved
POST   /api/progress/time            # Record time spent
```

Full API documentation: see [backend/README.md](backend/README.md)

## 🎓 Usage Guide

### For Students
1. Sign up as a student
2. Browse courses on dashboard
3. Open a course to see lessons
4. Click a lesson to start learning
5. Read notes and solve problems
6. Timer automatically tracks time spent
7. Progress syncs to backend on page unmount

### For Instructors
1. Sign up as an instructor
2. Click "New Course" button on dashboard
3. Enter course title and subtitle
4. Create lessons with notes and problems
5. Students can then enroll and track progress

## 🧪 Testing

### Manual API Testing
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password",
    "role": "student"
  }'

# List courses
curl http://localhost:5000/api/courses
```

### Frontend Testing
- Open browser to `http://localhost:3000`
- Test signup/login flow
- Verify course browsing
- Check timer on lesson page
- Verify progress tracking

## 📖 Documentation

- **[Backend README](backend/README.md)** — Server setup, API details, models, authentication
- **[Frontend README](frontend/README.md)** — Client setup, components, routing, features

## ✨ Code Quality Highlights

- ✅ **MVC Architecture** — Clear separation of concerns
- ✅ **Clean Components** — Reusable, functional React components
- ✅ **Error Handling** — Try-catch with meaningful messages
- ✅ **Authorization** — Backend + frontend checks
- ✅ **Type Safety** — Proper MongoDB schemas
- ✅ **Responsive UI** — Mobile-first design
- ✅ **No Hardcoded Values** — Environment-based config
- ✅ **Production Ready** — Scalable, maintainable code

## 🛠️ Development Notes

### File Organization
- Keep business logic in controllers, not routes
- Use Axios interceptor for JWT handling
- Separate API calls into `services/api.js`
- Use React Context for global state (Auth)
- Reuse components via props and composition

### Common Tasks

**Add a new API endpoint:**
1. Create controller method
2. Add route in routes file
3. Mount route in app.js
4. Call from frontend via api.js

**Add a new page:**
1. Create component in `src/pages/`
2. Add route in App.jsx
3. Wrap with `<ProtectedRoute>` if needed
4. Create link in Header or another page

**Extend Progress Tracking:**
- Models: Already supports timeSpent, solvedProblems, notesCompleted
- API: /progress endpoints handle reads/writes
- Frontend: LessonPage manages timer and calls backend

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
DB_URI=mongodb://127.0.0.1:27017/learning_platform
JWT_SECRET=your_secret_key
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:5000/api
```

## 🚢 Deployment

### Backend (Heroku example)
```bash
git push heroku main
# Set env vars via Heroku dashboard
```

### Frontend (Vercel example)
```bash
npm run build
vercel deploy
```

## 📈 Future Enhancements

- [ ] Analytics dashboard for instructors (charts, engagement metrics)
- [ ] Notifications (new lesson, progress alerts)
- [ ] Real-time collaboration (student hints, Q&A)
- [ ] File uploads (lesson resources, problem attachments)
- [ ] Discussion forums per course
- [ ] Grading system for instructors
- [ ] Mobile app (React Native)
- [ ] Certificate generation on completion

## 📄 License

MIT

---

**Author**: Built as a production-ready learning platform.

**Last Updated**: December 2025

For questions or support, refer to the individual README files in `backend/` and `frontend/` directories.

