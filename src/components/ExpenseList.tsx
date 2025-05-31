import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, Heading, Button, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { expenses } from '../services/expenses'
import type { Expense } from '../services/expenses'
import { account } from '../services/config'

export const ExpenseList = () => {
  const [expensesList, setExpensesList] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
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

  const totalExpenses = expensesList.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <Box>
      <Box mb={6}>
        <Heading size="md" mb={2}>Expense History</Heading>
        <Text color="gray.500" fontSize="sm">View and manage your expenses</Text>
      </Box>

      <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
        <Box p={4} borderBottom="1px" borderColor="gray.100">
          <Text fontWeight="medium">Total Expenses: ${totalExpenses.toFixed(2)}</Text>
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
              {expensesList.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Text textAlign="center" py={4} color="gray.500">
                      {isLoading ? 'Loading expenses...' : 'No expenses added yet'}
                    </Text>
                  </Td>
                </Tr>
              ) : (
                expensesList.map((expense) => (
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
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
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