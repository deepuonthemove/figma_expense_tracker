import { Box, Button, FormControl, FormLabel, Input, Select, VStack, Heading, Text, useToast } from '@chakra-ui/react'
import { useState } from 'react'

interface ExpenseFormData {
  description: string
  amount: number
  category: string
  date: string
}

interface ExpenseFormProps {
  onSubmit: (expense: Omit<ExpenseFormData, 'id'>) => void
}

export const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Omit<ExpenseFormData, 'id'>>({
    description: '',
    amount: 0,
    category: '',
    date: new Date().toISOString().split('T')[0]
  })
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }
    onSubmit(formData)
    setFormData({
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0]
    })
    toast({
      title: 'Success',
      description: 'Expense added successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="white" borderRadius="lg" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Add New Expense</Heading>
          <Text color="gray.500" fontSize="sm">Fill in the details below to add a new expense</Text>
        </Box>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Description</FormLabel>
          <Input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter expense description"
            size="lg"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Amount</FormLabel>
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            placeholder="Enter amount"
            size="lg"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Category</FormLabel>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Select a category"
            size="lg"
          >
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontWeight="medium">Date</FormLabel>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            size="lg"
          />
        </FormControl>

        <Button type="submit" colorScheme="brand" size="lg" width="full">
          Add Expense
        </Button>
      </VStack>
    </Box>
  )
} 