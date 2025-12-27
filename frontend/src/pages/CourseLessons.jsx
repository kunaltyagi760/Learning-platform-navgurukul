import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Box, Heading, Button, VStack, HStack, Spinner, Center, Text, 
  Grid, GridItem, Badge, Progress
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function CourseLessons() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      if (!user) return navigate('/login')
      try {
        const courseRes = await api.get(`/courses/${id}`)
        setCourse(courseRes.data)

        const lessonsRes = await api.get(`/courses/${id}/lessons`)
        setLessons(lessonsRes.data)

        // Load progress for each lesson (only for students)
        if (user.role === 'student') {
          const progressData = {}
          for (const lesson of lessonsRes.data) {
            try {
              const progRes = await api.get(`/progress/${lesson._id}`)
              progressData[lesson._id] = progRes.data
            } catch (err) {
              progressData[lesson._id] = { notesCompleted: false, solvedProblems: [], timeSpent: 0 }
            }
          }
          setProgress(progressData)
        }
      } catch (err) {
        console.error('Failed to load course', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, user, navigate])

  const isInstructor = user?.role === 'instructor'
  const isOwner = course && user && course.instructorId === user.userId

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  if (loading) return <Center h="400px"><Spinner size="lg" /></Center>
  if (!course) return <Box p={6}><Text>Course not found</Text></Box>

  return (
    <Box maxW="5xl" mx="auto" p={6}>
      {/* Course Header */}
      <HStack justify="space-between" align="start" mb={8}>
        <VStack align="start" spacing={2}>
          <Heading>{course.title}</Heading>
          <Text fontSize="lg" color="gray.600">{course.subtitle}</Text>
          {isInstructor && <Badge colorScheme="blue">You are the instructor</Badge>}
        </VStack>
      </HStack>

      {/* Add Lesson Button (Instructor Only) */}
      {isOwner && (
        <Button
          leftIcon={<AddIcon />}
          colorScheme="green"
          mb={8}
          onClick={() => navigate(`/courses/${id}/add-lesson`)}
        >
          Add Lesson
        </Button>
      )}

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <Center h="200px">
          <Text fontSize="lg" color="gray.500">No lessons yet</Text>
        </Center>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {lessons.map(lesson => {
            const lessonProgress = progress[lesson._id]
            const problemsCount = lesson.problems?.length || 0
            const solvedCount = lessonProgress?.solvedProblems?.length || 0
            const notesCompleted = lessonProgress?.notesCompleted || false
            const timeSpent = lessonProgress?.timeSpent || 0

            return (
              <GridItem key={lesson._id}>
                <Box
                  p={6}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="white"
                  cursor="pointer"
                  _hover={{ shadow: 'lg', borderColor: 'blue.300' }}
                  transition="all 0.2s"
                >
                  <Link to={`/lessons/${lesson._id}`} style={{ textDecoration: 'none' }}>
                    <VStack align="start" spacing={4}>
                      <Heading size="md">{lesson.title}</Heading>

                      {/* Student Progress */}
                      {!isInstructor && lessonProgress && (
                        <>
                          {/* Notes Progress */}
                          <Box w="full">
                            <HStack justify="space-between" mb={1}>
                              <Text fontSize="sm" fontWeight="medium">Notes</Text>
                              <Badge colorScheme={notesCompleted ? 'green' : 'gray'}>
                                {notesCompleted ? 'Completed' : 'Pending'}
                              </Badge>
                            </HStack>
                            <Progress value={notesCompleted ? 100 : 0} colorScheme={notesCompleted ? 'green' : 'gray'} />
                          </Box>

                          {/* Problems Progress */}
                          {problemsCount > 0 && (
                            <Box w="full">
                              <HStack justify="space-between" mb={1}>
                                <Text fontSize="sm" fontWeight="medium">Problems</Text>
                                <Text fontSize="sm" color="gray.600">{solvedCount}/{problemsCount}</Text>
                              </HStack>
                              <Progress
                                value={problemsCount > 0 ? (solvedCount / problemsCount) * 100 : 0}
                                colorScheme="blue"
                              />
                            </Box>
                          )}

                          {/* Time Spent */}
                          <HStack justify="space-between" w="full" fontSize="sm" color="gray.600">
                            <Text>Time spent:</Text>
                            <Text fontWeight="medium">{formatTime(timeSpent)}</Text>
                          </HStack>
                        </>
                      )}

                      {/* Instructor View */}
                      {isInstructor && (
                        <VStack align="start" w="full" spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            <strong>{problemsCount}</strong> problems
                          </Text>
                          {lesson.notes && (
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              <strong>Notes:</strong> {lesson.notes}
                            </Text>
                          )}
                        </VStack>
                      )}
                    </VStack>
                  </Link>

                  {/* Edit Button (Instructor Only) */}
                  {isOwner && (
                    <Button
                      size="sm"
                      variant="outline"
                      w="full"
                      mt={4}
                      onClick={() => navigate(`/lessons/${lesson._id}/edit`)}
                    >
                      Edit Lesson
                    </Button>
                  )}
                </Box>
              </GridItem>
            )
          })}
        </Grid>
      )}
    </Box>
  )
}
