import { Box, Container, Flex, Heading, Button, useColorMode } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onLogout?: () => void
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/login')
  }

  return (
    <Box as="header" position="sticky" top={0} zIndex={1} bg="white" borderBottom="1px" borderColor="gray.200">
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Heading size="md" color="brand.500" cursor="pointer" onClick={() => navigate('/dashboard')}>
            Expense Tracker
          </Heading>

          <Flex alignItems="center" gap={4}>
            <Button variant="ghost" onClick={toggleColorMode}>
              {colorMode === 'light' ? '🌙' : '☀️'}
            </Button>
            {onLogout && (
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
} 