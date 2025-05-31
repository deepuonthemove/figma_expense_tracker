import { ID } from 'appwrite'
import { account } from '../config/appwrite'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
}

export const authService = {
  async login({ email, password }: LoginCredentials) {
    try {
      const session = await account.createSession(email, password)
      return session
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async register({ email, password, name }: RegisterCredentials) {
    try {
      const user = await account.create(ID.unique(), email, password, name)
      await this.login({ email, password })
      return user
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  async logout() {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  async getCurrentUser() {
    try {
      return await account.get()
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  async isAuthenticated() {
    try {
      await account.get()
      return true
    } catch {
      return false
    }
  }
} 