import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import CourseLessons from './pages/CourseLessons'
import LessonPage from './pages/LessonPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateCourse from './pages/CreateCourse'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/courses/:id" element={<ProtectedRoute><CourseLessons /></ProtectedRoute>} />
        <Route path="/lessons/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/create-course" element={<ProtectedRoute role="instructor"><CreateCourse /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}
