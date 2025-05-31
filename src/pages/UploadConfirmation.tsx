import { Box, Button, Container, Heading, Text, VStack, Icon/*, useToast*/ } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { FiCheckCircle } from 'react-icons/fi'

export const UploadConfirmation = () => {
  const navigate = useNavigate()
  // const toast = useToast()

  const handleViewExpenses = () => {
    navigate('/list')
  }

  const handleUploadMore = () => {
    navigate('/upload')
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.md" py={8}>
        <VStack spacing={8} align="stretch">
          <Box bg="white" p={8} borderRadius="lg" boxShadow="sm" textAlign="center">
            <VStack spacing={6}>
              <Icon as={FiCheckCircle} w={16} h={16} color="green.500" />
              <Heading size="lg">Upload Successful!</Heading>
              <Text color="gray.600">
                Your expense documents have been successfully uploaded and are being processed.
                You will be notified once the processing is complete.
              </Text>

              <VStack spacing={4} width="full" pt={4}>
                <Button
                  colorScheme="brand"
                  size="lg"
                  width="full"
                  onClick={handleViewExpenses}
                >
                  View Expenses
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  width="full"
                  onClick={handleUploadMore}
                >
                  Upload More
                </Button>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
} 