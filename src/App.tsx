import { ChakraProvider, CSSReset } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Upload } from './pages/Upload'
import { UploadConfirmation } from './pages/UploadConfirmation'
import { ExpenseList } from './components/ExpenseList'
import { useState } from 'react'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogout = () => {
    setIsAuthenticated(false)
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
