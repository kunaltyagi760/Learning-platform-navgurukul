import React from 'react'
import { Flex, Box, Button, VStack } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = React.useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Flex as="header" p={4} bg="gray.100" justify="space-between" align="center" boxShadow="sm">
      <Box fontWeight="bold" fontSize="lg">
        <Link to="/">📚 Learning Platform</Link>
      </Box>
      
      <Flex gap={4} align="center">
        {user ? (
          <>
            <Box fontSize="sm">
              <span>{user.name}</span>
              <span> · {user.role}</span>
            </Box>
            {user.role === 'instructor' && (
              <Link to="/create-course">
                <Button size="sm" colorScheme="green">New Course</Button>
              </Link>
            )}
            <Button size="sm" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button size="sm" variant="ghost">Login</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" colorScheme="blue">Sign Up</Button>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  )
}
