import React from 'react'
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <Box borderWidth={1} borderRadius="md" p={5} bg="white" shadow="sm" _hover={{ shadow: 'md' }} transition="all 0.2s">
      <Heading size="md" mb={2}>{course.title}</Heading>
      <Text color="gray.600" mb={3}>{course.subtitle}</Text>
      <Text fontSize="sm" color="gray.500" mb={4}>Instructor: {course.instructorId?.name || 'Unknown'}</Text>
      <Link to={`/courses/${course._id}`}>
        <Button colorScheme="blue" size="sm" w="full">View Lessons</Button>
      </Link>
    </Box>
  )
}
