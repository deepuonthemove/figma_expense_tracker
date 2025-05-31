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
  Text,
  useToast,
  VStack,
  Icon,
} from '@chakra-ui/react'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { expenses } from '../services/expenses'
import { account } from '../config/appwrite'
import { storageService } from '../services/storage'
import { FiUpload } from 'react-icons/fi'

export const Upload = () => {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First check if we have an active session with retry
      let sessionValid = false
      let retryCount = 0
      const maxRetries = 2
      
      while (!sessionValid && retryCount < maxRetries) {
        try {
          const session = await account.getSession('current')
          if (session && session.$id) {
            sessionValid = true
            break
          }
        } catch (sessionError) {
          console.warn(`Session check attempt ${retryCount + 1} failed:`, sessionError)
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 300))
          retryCount++
        }
      }
      
      if (!sessionValid) {
        console.error('No valid session found after retries')
        toast({
          title: 'Authentication Error',
          description: 'Your session has expired. Please log in again to add expenses.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        navigate('/login')
        return
      }

      // Now get the user details
      let user
      try {
        user = await account.get()
        if (!user || !user.$id) {
          throw new Error('Could not retrieve user details')
        }
      } catch (userError) {
        console.error('User details error:', userError)
        toast({
          title: 'Authentication Error',
          description: 'Could not retrieve your account details. Please log in again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
        navigate('/login')
        return
      }

      // Handle file upload if selected
      let receiptUrl = undefined
      if (selectedFile) {
        try {
          const fileResponse = await storageService.uploadFile(selectedFile)
          if (fileResponse) {
            receiptUrl = fileResponse.$id
          }
        } catch (error: any) {
          console.error('File upload error:', error)
          
          // Check if it's a permissions error
          if (error?.code === 401 || error?.code === 403) {
            toast({
              title: 'Permission Error',
              description: 'You do not have permission to upload files. Please log in again.',
              status: 'error',
              duration: 4000,
              isClosable: true,
            })
            navigate('/login')
            return
          } else {
            toast({
              title: 'Upload Warning',
              description: 'Failed to upload receipt. The expense will be saved without the receipt.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
            })
          }
        }
      }

      // Create the expense
      try {
        await expenses.create({
          amount: parseFloat(amount),
          category,
          description,
          date,
          userId: user.$id,
          receiptUrl
        })
        
        navigate('/upload-confirmation')
      } catch (createError: any) {
        console.error('Error creating expense:', createError)
        
        if (createError.code === 401 || createError.code === 403) {
          toast({
            title: 'Permission Error',
            description: 'You do not have permission to create expenses. Please log in again.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
          navigate('/login')
        } else {
          toast({
            title: 'Error',
            description: 'Failed to save expense. Please try again.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          })
        }
      }
    } catch (error: any) {
      console.error('Error adding expense:', error)
      let errorMessage = 'Failed to add expense'
      
      if (error?.code === 401 || error?.code === 403) {
        errorMessage = 'Please log in to continue'
        navigate('/login')
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 4000,
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
            <VStack spacing={6}>
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

              <FormControl>
                <FormLabel>Receipt (Optional)</FormLabel>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  display="none"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<Icon as={FiUpload} />}
                  variant="outline"
                  width="full"
                >
                  {selectedFile ? selectedFile.name : 'Upload Receipt'}
                </Button>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="full"
                isLoading={isLoading}
              >
                Add Expense
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  )
} 