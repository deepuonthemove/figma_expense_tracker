import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, Heading, Button, useToast, Container, HStack, Select, Input, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { expenses } from '../services/expenses'
import type { Expense } from '../services/expenses'
import { account } from '../config/appwrite'
import { Header } from './Header'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'

export const ExpenseList = () => {
  const [expensesList, setExpensesList] = useState<Expense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
  })
  const itemsPerPage = 10
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, expensesList])

  const loadExpenses = async () => {
    try {
      const user = await account.get()
      const data = await expenses.list(user.$id)
      setExpensesList(data)
      setFilteredExpenses(data)
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

  const applyFilters = () => {
    let filtered = [...expensesList]

    if (filters.startDate) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(filters.startDate))
    }

    if (filters.endDate) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(filters.endDate))
    }

    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category)
    }

    setFilteredExpenses(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleDelete = async (expenseId: string) => {
    try {
      await expenses.delete(expenseId)
      await loadExpenses()
      toast({
        title: 'Success',
        description: 'Expense deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex)

  return (
    <Box minH="100vh" bg="gray.50">
      <Header onLogout={handleLogout} />
      <Container maxW="container.xl" py={8}>
        <Box mb={6}>
          <Heading size="md" mb={2}>Expense History</Heading>
          <Text color="gray.500" fontSize="sm">View and manage your expenses</Text>
        </Box>

        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
          <Box p={4} borderBottom="1px" borderColor="gray.100">
            <Text fontWeight="medium">Total Expenses: ${totalExpenses.toFixed(2)}</Text>
          </Box>

          <Box p={4} borderBottom="1px" borderColor="gray.100">
            <HStack spacing={4}>
              <Box>
                <Text fontSize="sm" mb={1}>Start Date</Text>
                <Input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  size="sm"
                />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>End Date</Text>
                <Input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  size="sm"
                />
              </Box>
              <Box>
                <Text fontSize="sm" mb={1}>Category</Text>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  placeholder="All Categories"
                  size="sm"
                >
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </Select>
              </Box>
            </HStack>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Description</Th>
                  <Th>Category</Th>
                  <Th isNumeric>Amount</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentExpenses.length === 0 ? (
                  <Tr>
                    <Td colSpan={5}>
                      <Text textAlign="center" py={4} color="gray.500">
                        {isLoading ? 'Loading expenses...' : 'No expenses found'}
                      </Text>
                    </Td>
                  </Tr>
                ) :
                  currentExpenses.map((expense) => (
                    <Tr key={expense.id} _hover={{ bg: 'gray.50' }}>
                      <Td>{new Date(expense.date).toLocaleDateString()}</Td>
                      <Td>{expense.description}</Td>
                      <Td>
                        <Badge colorScheme={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                      </Td>
                      <Td isNumeric fontWeight="medium">
                        ${expense.amount.toFixed(2)}
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))
                }
              </Tbody>
            </Table>
          </Box>

          {totalPages > 1 && (
            <Box p={4} borderTop="1px" borderColor="gray.100">
              <Flex justify="center" align="center">
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  isDisabled={currentPage === 1}
                  mr={2}
                >
                  Previous
                </Button>
                <Text mx={4}>
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  isDisabled={currentPage === totalPages}
                  ml={2}
                >
                  Next
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    food: 'green',
    transportation: 'blue',
    utilities: 'purple',
    entertainment: 'orange',
    other: 'gray'
  }
  return colors[category] || 'gray'
} 