import {
  Box,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'

interface DashboardProps {
  onLogout: () => void
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const navigate = useNavigate()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  const stats = [
    { label: 'Total Expenses', value: '$2,500' },
    { label: 'This Month', value: '$850' },
    { label: 'Average Daily', value: '$28.33' },
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      <Header onLogout={onLogout} />
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading size="lg" mb={2}>Welcome back!</Heading>
          <Text color="gray.600">Here's an overview of your expenses</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          {stats.map((stat) => (
            <Box
              key={stat.label}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
            >
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber fontSize="2xl">{stat.value}</StatNumber>
              </Stat>
            </Box>
          ))}
        </SimpleGrid>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            cursor="pointer"
            onClick={() => navigate('/list')}
            _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
          >
            <Heading size="md" mb={2}>View Expenses</Heading>
            <Text color="gray.600">See your complete expense history and manage your records</Text>
          </Box>

          <Box
            bg={bgColor}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            cursor="pointer"
            onClick={() => navigate('/upload')}
            _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
          >
            <Heading size="md" mb={2}>Upload Expenses</Heading>
            <Text color="gray.600">Add new expenses by uploading receipts or entering details manually</Text>
          </Box>
        </Grid>
      </Container>
    </Box>
  )
} 