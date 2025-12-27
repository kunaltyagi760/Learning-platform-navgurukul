import React, { useState, useContext } from 'react'
import { Box, Input, Button, VStack, Heading, useToast } from '@chakra-ui/react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast({ title: 'Logged in!', status: 'success' })
      navigate('/')
    } catch (err) {
      console.error(err)
      toast({ title: 'Login failed', status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box maxW="md" mx="auto" mt={12} p={6} borderWidth={1} borderRadius="md" bg="white">
      <Heading mb={6} textAlign="center">Login</Heading>
      <form onSubmit={submit}>
        <VStack spacing={4}>
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
          <Button type="submit" colorScheme="blue" w="full" isLoading={loading}>
            Login
          </Button>
        </VStack>
      </form>
      <Box mt={4} textAlign="center">
        <span>New? </span>
        <Link to="/signup">
          <Box as="span" color="blue.500" cursor="pointer">Sign up</Box>
        </Link>
      </Box>
    </Box>
  )
}
