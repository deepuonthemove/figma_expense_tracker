import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Text,
  Spinner,
  useToast,
  Button,
  HStack,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { useEffect, useState } from 'react'
import { expenses } from '../services/expenses'
import type { Expense } from '../services/expenses'
import { account } from '../config/appwrite'
import { authService } from '../services/auth'

interface DashboardProps {
  onLogout: () => Promise<void>;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [expensesList, setExpensesList] = useState<Expense[]>([])
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      // Check if user is authenticated before loading expenses
      const isAuth = await authService.isAuthenticated()
      if (!isAuth) {
        // If not authenticated, don't try to load expenses
        setIsLoading(false)
        return
      }
      
      const user = await account.get()
      const data = await expenses.list(user.$id)
      setExpensesList(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load expenses',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = () => {
    const total = expensesList.reduce((sum, expense) => sum + expense.amount, 0)
    
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonth = expensesList
      .filter(expense => new Date(expense.date) >= firstDayOfMonth)
      .reduce((sum, expense) => sum + expense.amount, 0)
    
    const last30Days = expensesList
      .filter(expense => {
        const expenseDate = new Date(expense.date)
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return expenseDate >= thirtyDaysAgo
      })
      .reduce((sum, expense) => sum + expense.amount, 0)
    
    const averageDaily = last30Days / 30

    return {
      total,
      thisMonth,
      averageDaily
    }
  }

  const stats = calculateStats()

  return (
    <Box minH="100vh" bg="gray.50">
      <Header onLogout={onLogout} />
      <Container maxW="container.xl" py={8}>
        <Box mb={6}>
          <Heading size="md" mb={2}>Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">Overview of your expenses</Text>
        </Box>

        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
          </Box>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Stat
                px={4}
                py={5}
                bg="white"
                rounded="lg"
                boxShadow="sm"
              >
                <StatLabel>Total Expenses</StatLabel>
                <StatNumber>${stats.total.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  All time
                </StatHelpText>
              </Stat>

              <Stat
                px={4}
                py={5}
                bg="white"
                rounded="lg"
                boxShadow="sm"
              >
                <StatLabel>This Month</StatLabel>
                <StatNumber>${stats.thisMonth.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  Current month
                </StatHelpText>
              </Stat>

              <Stat
                px={4}
                py={5}
                bg="white"
                rounded="lg"
                boxShadow="sm"
              >
                <StatLabel>Average Daily</StatLabel>
                <StatNumber>${stats.averageDaily.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  Last 30 days
                </StatHelpText>
              </Stat>
            </SimpleGrid>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <HStack spacing={4} justify="center">
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={() => navigate('/list')}
                >
                  View Expenses
                </Button>
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={() => navigate('/upload')}
                >
                  Add New Expense
                </Button>
              </HStack>
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
} 