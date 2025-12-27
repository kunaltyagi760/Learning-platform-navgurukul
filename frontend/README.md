# Learning Platform Frontend

**Vite + React + Chakra UI** frontend for the Progressive Student Dashboard.

## Overview

A responsive, production-ready student learning platform where students track their progress and instructors manage courses and lessons. Features real-time timer tracking, progress bars, and role-based UI.

## Features

- 📚 **Course Browsing**: Public course list with instructor info
- 👨‍🎓 **Student Features**:
  - View lessons and notes
  - Track problem-solving progress with visual indicators
  - Automatic time tracking per lesson (saved on page unmount)
  - Mark notes as complete
  - Mark problems as solved
- 👨‍🏫 **Instructor Features**:
  - Create and manage courses
  - Add lessons with notes and problems
  - View student progress
- 🔐 **Authentication**: Login/Signup with JWT stored in localStorage
- 🎨 **UI**: Chakra UI components, fully responsive, clean and modern design

## Tech Stack

- **Vite** — Fast bundler
- **React 18** — UI library
- **Chakra UI** — Component library
- **React Router** — Client-side routing
- **Axios** — HTTP client with JWT interceptor
- **JavaScript** — Clean, modern ES6+

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── CourseCard.jsx
│   │   ├── ProtectedRoute.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── CreateCourse.jsx
│   │   ├── CourseLessons.jsx
│   │   ├── LessonPage.jsx
│   ├── services/         # API layer
│   │   └── api.js
│   ├── context/          # State management
│   │   └── AuthContext.jsx
│   ├── theme/            # Chakra theme
│   │   └── index.js
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── vite.config.js       # Vite config
├── package.json
└── README.md
```

## Setup & Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

Default `.env`:
```
VITE_API_BASE=http://localhost:5000/api
```

### 3. Run Development Server

```bash
npm run dev
```

Frontend runs on `http://localhost:3000` (or the next available port). Access at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
```

Output in `dist/` folder.

## API Integration

The frontend uses **Axios** to call the backend at `/api` endpoint. JWT token is automatically attached to every authenticated request via request interceptor.

### Login Flow

1. User enters email/password on `/login`
2. Backend returns `{ token, user: { id, name, email, role } }`
3. Token stored in `localStorage` as `token`
4. User object stored in context and localStorage
5. Redirect to home page

### Time Tracking

- Timer starts when lesson page mounts
- Timer runs continuously while on lesson page
- On page unmount (navigate away), delta (seconds) is POSTed to `/api/progress/time`
- Backend accumulates time for each student per lesson

### Protected Routes

Use `<ProtectedRoute>` wrapper:
```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

For instructor-only routes:
```jsx
<ProtectedRoute role="instructor">
  <InstructorComponent />
</ProtectedRoute>
```

## Default Test Credentials (After Seeding Backend)

**Student:**
- Email: `bob@student.com`
- Password: `password`

**Instructor:**
- Email: `alice@teach.com`
- Password: `password`

## Code Quality

- **Clean Components**: Functional components with hooks
- **Reusable**: Extracted CourseCard, ProtectedRoute, Header
- **Error Handling**: Try-catch with toast notifications
- **Loading States**: Spinners while fetching
- **Responsive**: Works on mobile, tablet, desktop

## Notes

- JWT is stored in browser `localStorage` (for production, consider httpOnly cookies)
- API base URL configurable via `VITE_API_BASE` env variable
- Timer accuracy: tracks elapsed time in seconds
- Progress sync: auto-synced to backend on lesson unmount

---

See `/backend/README.md` for backend setup and API details.
