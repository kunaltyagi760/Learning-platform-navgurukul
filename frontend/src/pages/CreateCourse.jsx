import React, { useState, useContext } from 'react'
import {
  Box, Input, Button, VStack, HStack, Heading, useToast, Text,
  FormControl, FormLabel, Textarea, IconButton, Table, Thead, Tbody, Tr, Th, Td
} from '@chakra-ui/react'
import { DeleteIcon, AddIcon } from '@chakra-ui/icons'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function CreateCourse() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [lessons, setLessons] = useState([])
  const [currentLessonTitle, setCurrentLessonTitle] = useState('')
  const [currentNotes, setCurrentNotes] = useState('')
  const [currentProblems, setCurrentProblems] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  if (!user || user.role !== 'instructor') {
    return <Box p={6}><Heading>Only instructors can create courses</Heading></Box>
  }

  const addLesson = () => {
    if (!currentLessonTitle) {
      toast({ title: 'Lesson title required', status: 'error' })
      return
    }
    
    const problemsArray = currentProblems
      .split('\n')
      .filter(p => p.trim())
      .map(q => ({ question: q.trim() }))

    const newLesson = {
      tempId: Date.now(),
      title: currentLessonTitle,
      notes: currentNotes,
      problems: problemsArray
    }
    
    setLessons([...lessons, newLesson])
    setCurrentLessonTitle('')
    setCurrentNotes('')
    setCurrentProblems('')
    toast({ title: 'Lesson added!', status: 'success' })
  }

  const removeLesson = (tempId) => {
    setLessons(lessons.filter(l => l.tempId !== tempId))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!title) {
      toast({ title: 'Course title required', status: 'error' })
      return
    }

    setLoading(true)
    try {
      // Create course
      const courseRes = await api.post('/courses', { title, subtitle })
      const courseId = courseRes.data._id

      // Create lessons
      for (const lesson of lessons) {
        const lessonData = {
          courseId,
          title: lesson.title,
          notes: lesson.notes,
          problems: lesson.problems
        }
        await api.post('/lessons', lessonData)
      }

      toast({ title: 'Course with lessons created!', status: 'success' })
      navigate('/')
    } catch (err) {
      console.error(err)
      toast({ title: 'Failed to create course', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="5xl" mx="auto" mt={8} p={6}>
      <Heading mb={6}>Create New Course</Heading>
      <form onSubmit={submit}>
        <VStack spacing={6} align="stretch">
          {/* Course Info */}
          <Box p={6} borderWidth={1} borderRadius="md" bg="white">
            <Heading size="md" mb={4}>Course Information</Heading>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Course Title</FormLabel>
                <Input
                  placeholder="e.g., Web Development Basics"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  size="lg"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Course Subtitle</FormLabel>
                <Input
                  placeholder="e.g., Learn HTML, CSS, and JavaScript"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  size="lg"
                />
              </FormControl>
            </VStack>
          </Box>

          {/* Add Lesson Form */}
          <Box p={6} borderWidth={1} borderRadius="md" bg="blue.50">
            <Heading size="md" mb={4}>Add Lessons</Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Lesson Title</FormLabel>
                <Input
                  placeholder="e.g., Introduction to HTML"
                  value={currentLessonTitle}
                  onChange={e => setCurrentLessonTitle(e.target.value)}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  placeholder="Write lesson notes here..."
                  value={currentNotes}
                  onChange={e => setCurrentNotes(e.target.value)}
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Problems (one per line)</FormLabel>
                <Textarea
                  placeholder="Problem 1&#10;Problem 2&#10;Problem 3"
                  value={currentProblems}
                  onChange={e => setCurrentProblems(e.target.value)}
                  rows={4}
                />
              </FormControl>

              <Button
                leftIcon={<AddIcon />}
                colorScheme="blue"
                onClick={addLesson}
                w="full"
              >
                Add Lesson to Course
              </Button>
            </VStack>
          </Box>

          {/* Lessons List */}
          {lessons.length > 0 && (
            <Box p={6} borderWidth={1} borderRadius="md" bg="green.50">
              <Heading size="md" mb={4}>Lessons ({lessons.length})</Heading>
              <VStack spacing={4} align="stretch">
                {lessons.map(lesson => (
                  <Box key={lesson.tempId} p={4} borderWidth={1} borderRadius="md" bg="white">
                    <HStack justify="space-between" mb={2}>
                      <Heading size="sm">{lesson.title}</Heading>
                      <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removeLesson(lesson.tempId)}
                      />
                    </HStack>
                    {lesson.notes && <Text fontSize="sm" color="gray.600" mb={2}><strong>Notes:</strong> {lesson.notes.substring(0, 100)}...</Text>}
                    <Text fontSize="sm" color="gray.600"><strong>Problems:</strong> {lesson.problems.length}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="green"
            size="lg"
            w="full"
            isLoading={loading}
            isDisabled={!title}
          >
            Create Course {lessons.length > 0 && `with ${lessons.length} lessons`}
          </Button>
        </VStack>
      </form>
    </Box>
  )
}
