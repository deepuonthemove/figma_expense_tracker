import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { useState } from 'react'
import { authService } from '../services/auth'

interface LoginProps {
  onLoginSuccess: () => void
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First attempt login
      await authService.login({ email, password })
      
      // Check authentication status with retry
      let isAuth = false
      let retryCount = 0
      const maxRetries = 3
      
      while (!isAuth && retryCount < maxRetries) {
        try {
          isAuth = await authService.isAuthenticated()
          if (isAuth) break
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500))
          retryCount++
        } catch (authCheckError) {
          console.warn(`Auth check attempt ${retryCount + 1} failed:`, authCheckError)
          retryCount++
          if (retryCount >= maxRetries) throw authCheckError
        }
      }
      
      if (isAuth) {
        onLoginSuccess()
        toast({
          title: 'Login successful',
          description: 'Welcome back!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error('Authentication verification failed. Please try again.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Please check your email and password'
      
      if (error.message.includes('Authentication verification failed')) {
        errorMessage = 'Your login was processed, but we could not verify your session. Please try again.'
      } else if (error.code === 401) {
        errorMessage = 'Invalid email or password'
      } else if (error.code === 429) {
        errorMessage = 'Too many login attempts. Please try again later.'
      }
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create user account and attempt auto-login
      await authService.register({ email, password, name }, true)
      
      // Check authentication status with retry
      let isAuth = false
      let retryCount = 0
      const maxRetries = 3
      
      while (!isAuth && retryCount < maxRetries) {
        try {
          isAuth = await authService.isAuthenticated()
          if (isAuth) break
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500))
          retryCount++
        } catch (authCheckError) {
          console.warn(`Auth check attempt ${retryCount + 1} failed:`, authCheckError)
          retryCount++
          if (retryCount >= maxRetries) throw authCheckError
        }
      }
      
      if (isAuth) {
        onLoginSuccess() // Automatically log in after registration
        toast({
          title: 'Registration successful',
          description: 'Welcome to Expense Tracker!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Registration succeeded but auto-login failed
        toast({
          title: 'Registration successful',
          description: 'Your account was created, but we could not log you in automatically. Please try logging in.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        // Clear form
        setEmail('')
        setPassword('')
        setName('')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Please try again'
      
      if (error.code === 409) {
        errorMessage = 'An account with this email already exists'
      } else if (error.code === 429) {
        errorMessage = 'Too many registration attempts. Please try again later.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Registration failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'xs', md: 'sm' }}>Welcome to Expense Tracker</Heading>
              <Text color="gray.600">
                Sign in to your account or create a new one
              </Text>
            </Stack>
          </Stack>

          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg="white"
            boxShadow="md"
            borderRadius="xl"
          >
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>Login</Tab>
                <Tab>Register</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <form onSubmit={handleLogin}>
                    <Stack spacing="6">
                      <Stack spacing="5">
                        <FormControl>
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="password">Password</FormLabel>
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </FormControl>
                      </Stack>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        isLoading={isLoading}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </form>
                </TabPanel>
                <TabPanel>
                  <form onSubmit={handleRegister}>
                    <Stack spacing="6">
                      <Stack spacing="5">
                        <FormControl>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="register-email">Email</FormLabel>
                          <Input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel htmlFor="register-password">Password</FormLabel>
                          <Input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </FormControl>
                      </Stack>

                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        fontSize="md"
                        isLoading={isLoading}
                      >
                        Register
                      </Button>
                    </Stack>
                  </form>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
} 