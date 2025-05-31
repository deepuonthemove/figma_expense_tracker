import { Box, Container, Flex, Heading, Button, useColorMode, HStack, Link, useColorModeValue } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  onLogout?: () => void
}

export const Header = ({ onLogout }: HeaderProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { colorMode, toggleColorMode } = useColorMode()
  const activeColor = useColorModeValue('brand.500', 'brand.200')
  const inactiveColor = useColorModeValue('gray.600', 'gray.400')

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    navigate('/login')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <Box as="header" position="sticky" top={0} zIndex={1} bg={useColorModeValue('white', 'gray.800')} borderBottom="1px" borderColor={useColorModeValue('gray.200', 'gray.700')}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <Flex alignItems="center" gap={8}>
            <Heading size="md" color="brand.500" cursor="pointer" onClick={() => navigate('/dashboard')}>
              Expense Tracker
            </Heading>

            <HStack spacing={6}>
              <Link
                onClick={() => navigate('/dashboard')}
                color={isActive('/dashboard') ? activeColor : inactiveColor}
                fontWeight={isActive('/dashboard') ? 'bold' : 'normal'}
                _hover={{ color: activeColor }}
              >
                Dashboard
              </Link>
              <Link
                onClick={() => navigate('/list')}
                color={isActive('/list') ? activeColor : inactiveColor}
                fontWeight={isActive('/list') ? 'bold' : 'normal'}
                _hover={{ color: activeColor }}
              >
                Expenses
              </Link>
              <Link
                onClick={() => navigate('/upload')}
                color={isActive('/upload') ? activeColor : inactiveColor}
                fontWeight={isActive('/upload') ? 'bold' : 'normal'}
                _hover={{ color: activeColor }}
              >
                Add Expense
              </Link>
            </HStack>
          </Flex>

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