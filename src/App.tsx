import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { UploadConfirmation } from './pages/UploadConfirmation'
import { ExpenseList } from './components/ExpenseList'
import { useState, useEffect } from 'react'
import { authService } from './services/auth'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await authService.isAuthenticated()
        setIsAuthenticated(isAuth)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (isLoading) {
    return null // or a loading spinner
  }


  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLoginSuccess={() => setIsAuthenticated(true)} />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/list" 
            element={
              isAuthenticated ? (
                <ExpenseList />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/upload" 
            element={
              isAuthenticated ? (
                <Upload />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/upload-confirmation" 
            element={
              isAuthenticated ? (
                <UploadConfirmation />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
