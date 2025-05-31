import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { expenses } from '../services/expenses'
import { account } from '../services/config'

export const Upload = () => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await account.get()
      await expenses.create({
        amount: parseFloat(amount),
        category,
        description,
        date,
        userId: user.$id,
      })
      navigate('/upload-confirmation')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.md" py={8}>
        <Box mb={8}>
          <Heading size="lg" mb={2}>Add New Expense</Heading>
          <Text color="gray.600">Enter the details of your expense</Text>
        </Box>

        <Box bg="white" p={8} borderRadius="lg" boxShadow="sm">
          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              <FormControl isRequired>
                <FormLabel>Amount</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select category"
                >
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                isLoading={isLoading}
              >
                Add Expense
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
} 