import { ID } from 'appwrite'
import { account } from '../config/appwrite'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export interface AuthUser {
  $id: string
  name: string
  email: string
  // Add other user properties as needed
}

class AuthService {
  private currentUser: AuthUser | null = null
  private userPromise: Promise<AuthUser | null> | null = null

  async login({ email, password }: LoginCredentials) {
    try {
      const session = await account.createEmailPasswordSession(email, password)
      
      // Verify session was created successfully
      if (!session || !session.$id) {
        throw new Error('Failed to create session')
      }
      
      // Add a small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Try to get user details to verify authentication
      // Make multiple attempts if needed
      let user = null
      let attempts = 0
      const maxAttempts = 3
      
      while (!user && attempts < maxAttempts) {
        try {
          user = await account.get()
          // Store user in cache
          this.currentUser = user as AuthUser
          break
        } catch (userError) {
          console.warn(`Could not fetch user after login (attempt ${attempts + 1}):`, userError)
          attempts++
          if (attempts < maxAttempts) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        }
      }
      
      // Clear cached promises
      this.userPromise = null
      
      // If we couldn't get the user after multiple attempts, but we have a session,
      // force a session refresh and try one more time
      if (!user && session) {
        try {
          // Try to refresh the session state
          await account.getSession('current')
          user = await account.get()
          this.currentUser = user as AuthUser
        } catch (finalError) {
          console.error('Final attempt to get user failed:', finalError)
          // Still don't throw, as the session might be valid
        }
      }
      
      return session
    } catch (error: any) {
      console.error('Login error:', error)
      throw this.handleAuthError(error)
    }
  }

  async register({ email, password, name }: RegisterCredentials, autoLogin = true) {
    try {
      // Create the user account
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      )
      
      // Optionally create session immediately
      if (autoLogin) {
        // const session = await account.createEmailPasswordSession(email, password)
        
        // Add a small delay to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Try to get user details to verify authentication
        try {
          const authUser = await account.get()
          this.currentUser = authUser as AuthUser
        } catch (userError) {
          console.warn('Could not fetch user after registration:', userError)
          // Don't throw here, as the session might still be valid
          this.currentUser = null
        }
        
        this.userPromise = null
      }
      
      return user
    } catch (error: any) {
      console.error('Registration error:', error)
      throw this.handleAuthError(error)
    }
  }

  async logout() {
    try {
      await account.deleteSession('current')
      // Clear cached user data
      this.currentUser = null
      this.userPromise = null
    } catch (error: any) {
      console.error('Logout error:', error)
      // Even if logout fails, clear local state
      this.currentUser = null
      this.userPromise = null
      throw error
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Return cached user if available
    if (this.currentUser) {
      return this.currentUser
    }

    // Return existing promise if one is in flight
    if (this.userPromise) {
      return this.userPromise
    }

    // Create new promise and cache it
    this.userPromise = this.fetchCurrentUser()
    return this.userPromise
  }

  private async fetchCurrentUser(): Promise<AuthUser | null> {
    try {
      // First check if we have an active session
      try {
        const session = await account.getSession('current')
        if (!session || !session.$id) {
          console.log('No active session found')
          this.currentUser = null
          return null
        }
      } catch (sessionError) {
        console.warn('Session check failed:', sessionError)
        this.currentUser = null
        return null
      }
      
      // Now try to get the user
      const user = await account.get()
      this.currentUser = user as AuthUser
      return this.currentUser
    } catch (error) {
      console.error('Get current user error:', error)
      this.currentUser = null
      return null
    } finally {
      this.userPromise = null
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      // Return true immediately if we have a cached user
      if (this.currentUser) {
        return true
      }
      
      // First check if we have an active session
      let session = null
      try {
        session = await account.getSession('current')
        if (!session || !session.$id) {
          return false
        }
      } catch (sessionError) {
        console.warn('Session check failed in isAuthenticated:', sessionError)
        return false
      }
      
      // Then try to get the user with retry logic
      let user = null
      let attempts = 0
      const maxAttempts = 2
      
      while (!user && attempts < maxAttempts) {
        try {
          user = await this.getCurrentUser()
          if (user) {
            return true
          }
          
          attempts++
          if (attempts < maxAttempts) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        } catch (error) {
          console.error(`Authentication check attempt ${attempts + 1} failed:`, error)
          attempts++
          if (attempts >= maxAttempts) {
            return false
          }
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 300))
        }
      }
      
      return user !== null
    } catch (error) {
      console.error('Authentication check error:', error)
      return false
    }
  }

  async refreshUser(): Promise<AuthUser | null> {
    // Force refresh by clearing cache
    this.currentUser = null
    this.userPromise = null
    return this.getCurrentUser()
  }

  // Password reset functionality
  async sendPasswordReset(email: string) {
    try {
      return await account.createRecovery(email, `${window.location.origin}/reset-password`)
    } catch (error: any) {
      console.error('Password reset error:', error)
      throw this.handleAuthError(error)
    }
  }

  async confirmPasswordReset(userId: string, secret: string, password: string) {
    try {
      return await account.updateRecovery(userId, secret, password)
    } catch (error: any) {
      console.error('Password reset confirmation error:', error)
      throw this.handleAuthError(error)
    }
  }

  // Email verification
  async sendEmailVerification() {
    try {
      return await account.createVerification(`${window.location.origin}/verify-email`)
    } catch (error: any) {
      console.error('Email verification error:', error)
      throw this.handleAuthError(error)
    }
  }

  async confirmEmailVerification(userId: string, secret: string) {
    try {
      const result = await account.updateVerification(userId, secret)
      // Refresh user data after verification
      await this.refreshUser()
      return result
    } catch (error: any) {
      console.error('Email verification confirmation error:', error)
      throw this.handleAuthError(error)
    }
  }

  private handleAuthError(error: any) {
    // Customize error handling based on Appwrite error codes
    switch (error?.code) {
      case 401:
        return new Error('Invalid credentials')
      case 429:
        return new Error('Too many requests. Please try again later.')
      case 409:
        return new Error('User already exists')
      default:
        return error
    }
  }

  // Clear all cached data (useful for testing or manual cleanup)
  clearCache() {
    this.currentUser = null
    this.userPromise = null
  }
}

export const authService = new AuthService()