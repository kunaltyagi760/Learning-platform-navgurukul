import React, { useEffect, useState, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Heading, Text, Button, VStack, HStack, Checkbox, Progress, Spinner, Center,
  Badge, Divider
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function LessonPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timer, setTimer] = useState(0)
  const timerRef = useRef(null)
  const startTimeRef = useRef(null)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Load lesson and progress on mount
  useEffect(() => {
    const load = async () => {
      if (!user) return navigate('/login')
      try {
        const res = await api.get(`/lessons/${id}`)
        setLesson(res.data)

        const progRes = await api.get(`/progress/${id}`)
        setProgress(progRes.data)
        setTimer(progRes.data.timeSpent || 0)
      } catch (err) {
        console.error('Failed to load lesson', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user, navigate])

  // Start timer on mount
  useEffect(() => {
    startTimeRef.current = Date.now() - (timer * 1000)

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setTimer(elapsed)
    }, 1000)

    // Cleanup: send time delta on unmount
    return () => {
      clearInterval(timerRef.current)
      if (lesson && user) {
        const currentTime = Math.floor((Date.now() - startTimeRef.current) / 1000)
        const delta = currentTime - (progress?.timeSpent || 0)
        if (delta > 0) {
          api.post('/progress/time', {
            lessonId: id,
            delta
          }).catch(err => console.error('Failed to save time', err))
        }
      }
    }
  }, [id, lesson, user, progress])

  const toggleNotes = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await api.post('/progress/notes', {
        lessonId: id
      })
      setProgress(res.data)
    } catch (err) {
      console.error('Failed to mark notes', err)
    }
  }

  const markProblem = async (problemId) => {
    if (!user) return navigate('/login')
    try {
      const res = await api.post('/progress/problem', {
        lessonId: id,
        problemId
      })
      setProgress(res.data)
    } catch (err) {
      console.error('Failed to mark problem', err)
    }
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (loading) return <Center h="200px"><Spinner size="lg" /></Center>
  if (!lesson) return <Text>Lesson not found</Text>

  const solvedProblems = progress?.solvedProblems || []
  const problems = lesson.problems || []
  const problemsPercentage = problems.length > 0 ? (solvedProblems.length / problems.length) * 100 : 0
  const notesCompleted = progress?.notesCompleted || false

  return (
    <Box p={6} maxW="4xl" mx="auto">
      {/* Header with timer */}
      <HStack justify="space-between" mb={6} p={4} bg="gradient" borderRadius="md" shadow="md">
        <VStack align="start" spacing={0}>
          <Heading size="lg">{lesson.title}</Heading>
          <Text fontSize="sm" color="gray.600">Complete the lesson to track progress</Text>
        </VStack>
        <VStack align="end" spacing={0} bg="white" p={3} borderRadius="md" minW="120px">
          <Text fontSize="xs" color="gray.600" textAlign="right">Time Spent</Text>
          <Text fontSize="2xl" fontWeight="bold" fontFamily="mono">{formatTime(timer)}</Text>
        </VStack>
      </HStack>

      {/* Overall Progress */}
      <Box p={4} borderWidth={1} borderRadius="md" mb={6} bg="blue.50">
        <Heading size="sm" mb={3}>Overall Progress</Heading>
        <VStack spacing={3} align="stretch">
          {/* Notes Progress */}
          <Box>
            <HStack justify="space-between" mb={1}>
              <Text fontSize="sm" fontWeight="medium">Lesson Notes</Text>
              <Badge colorScheme={notesCompleted ? 'green' : 'gray'}>
                {notesCompleted ? 'âœ“ Completed' : 'Not Started'}
              </Badge>
            </HStack>
            <Progress value={notesCompleted ? 100 : 0} colorScheme={notesCompleted ? 'green' : 'gray'} />
          </Box>

          {/* Problems Progress */}
          {problems.length > 0 && (
            <Box>
              <HStack justify="space-between" mb={1}>
                <Text fontSize="sm" fontWeight="medium">Problems Solved</Text>
                <Text fontSize="sm" fontWeight="bold" color="blue.600">
                  {solvedProblems.length} / {problems.length}
                </Text>
              </HStack>
              <Progress
                value={problemsPercentage}
                colorScheme={problemsPercentage === 100 ? 'green' : 'blue'}
              />
            </Box>
          )}
        </VStack>
      </Box>

      <Divider my={6} />

      {/* Notes section */}
      <Box p={4} borderWidth={1} borderRadius="md" mb={6} bg="white" shadow="sm">
        <HStack justify="space-between" mb={4}>
          <Heading size="md">Lesson Notes</Heading>
          <Checkbox
            isChecked={notesCompleted}
            onChange={toggleNotes}
            colorScheme="green"
            size="lg"
          >
            <Text ms={2} fontWeight="medium">Mark Complete</Text>
          </Checkbox>
        </HStack>
        <Text whiteSpace="pre-wrap" lineHeight="tall" color="gray.700">
          {lesson.notes || 'No notes provided for this lesson'}
        </Text>
      </Box>

      {/* Problems section */}
      <Box p={4} borderWidth={1} borderRadius="md" bg="white" shadow="sm">
        <Heading size="md" mb={4}>Problems to Solve</Heading>

        {problems.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={8}>
            No problems for this lesson
          </Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {problems.map((p, idx) => {
              const isSolved = solvedProblems.map(String).includes(String(p._id))
              return (
                <Box
                  key={p._id || idx}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg={isSolved ? 'green.50' : 'gray.50'}
                  borderColor={isSolved ? 'green.200' : 'gray.200'}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between" align="start" spacing={4}>
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack>
                        <Badge colorScheme="blue">Problem {idx + 1}</Badge>
                        {isSolved && (
                          <Badge colorScheme="green" leftIcon={<CheckIcon />}>
                            Solved
                          </Badge>
                        )}
                      </HStack>
                      <Text fontWeight="medium" fontSize="md">
                        {p.question}
                      </Text>
                    </VStack>
                    <Button
                      colorScheme={isSolved ? 'green' : 'blue'}
                      variant={isSolved ? 'solid' : 'outline'}
                      onClick={() => markProblem(p._id || idx)}
                      minW="140px"
                      rightIcon={isSolved ? <CheckIcon /> : undefined}
                    >
                      {isSolved ? 'Solved' : 'Mark Solved'}
                    </Button>
                  </HStack>
                </Box>
              )
            })}
          </VStack>
        )}
      </Box>

      {/* Back Button */}
      <HStack mt={6} gap={4}>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        {problemsPercentage === 100 && notesCompleted && (
          <Badge colorScheme="green" p={3}>
            í¾‰ Lesson Completed!
          </Badge>
        )}
      </HStack>
    </Box>
  )
}
