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
      // Clear cached user to force refresh
      this.currentUser = null
      this.userPromise = null
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
        await account.createEmailPasswordSession(email, password)
        this.currentUser = null // Clear cache
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
    const user = await this.getCurrentUser()
    return user !== null
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