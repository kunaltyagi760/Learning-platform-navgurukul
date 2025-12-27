import React, { useEffect, useState, useContext } from 'react'
import { SimpleGrid, Box, Heading, Button, VStack, Text, Spinner, Center } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { AuthContext } from '../context/AuthContext'
import CourseCard from '../components/CourseCard'

export default function Dashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/courses')
        setCourses(res.data)
      } catch (err) {
        console.error('Failed to load courses', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Center h="200px"><Spinner /></Center>

  return (
    <Box p={6}>
      <VStack align="start" spacing={4} mb={6}>
        <Heading>Courses</Heading>
        {user?.role === 'instructor' && (
          <Link to="/create-course">
            <Button colorScheme="green">Create New Course</Button>
          </Link>
        )}
      </VStack>
      
      {courses.length === 0 ? (
        <Text>No courses available</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {courses.map(c => (
            <CourseCard key={c._id} course={c} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}
