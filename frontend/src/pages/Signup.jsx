import React, { useState, useContext } from 'react'
import { Box, Input, Button, VStack, Select, Heading, useToast } from '@chakra-ui/react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [loading, setLoading] = useState(false)
  const { signup } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      toast({ title: 'All fields required', status: 'error' })
      return
    }

    setLoading(true)
    try {
      await signup({ name, email, password, role })
      toast({ title: 'Account created!', status: 'success' })
      navigate('/')
    } catch (err) {
      console.error(err)
      toast({ title: 'Signup failed', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="md" bg="white">
      <Heading mb={6} textAlign="center">Sign Up</Heading>
      <form onSubmit={submit}>
        <VStack spacing={4}>
          <Input
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            size="lg"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            size="lg"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            size="lg"
          />
          <Select value={role} onChange={e => setRole(e.target.value)} size="lg">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </Select>
          <Button type="submit" colorScheme="green" w="full" isLoading={loading}>
            Sign Up
          </Button>
        </VStack>
      </form>
      <Box mt={4} textAlign="center">
        <span>Already have account? </span>
        <Link to="/login">
          <Box as="span" color="blue.500" cursor="pointer">Login</Box>
        </Link>
      </Box>
    </Box>
  )
}
