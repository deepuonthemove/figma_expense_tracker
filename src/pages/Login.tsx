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
      await authService.login({ email, password })
      onLoginSuccess()
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Please check your email and password',
        status: 'error',
        duration: 3000,
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
      await authService.register({ email, password, name })
      toast({
        title: 'Registration successful',
        description: 'Please log in with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      // Clear form
      setEmail('')
      setPassword('')
      setName('')
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 3000,
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