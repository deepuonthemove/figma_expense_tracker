import { Client, Account, Databases, Storage } from 'appwrite'

// Initialize Appwrite client
// Note: For production, consider using a custom domain as your API endpoint
// to enable secure cookie-based sessions instead of localStorage
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('682b0a6c0038c8da39e2') // Replace with your project ID

// Initialize Appwrite services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Database and Collection IDs
export const DATABASE_ID = 'expense-tracker'
export const COLLECTIONS = {
  EXPENSES: 'expenses',
  USERS: 'users'
}

// Storage bucket IDs
export const BUCKETS = {
  RECEIPTS: 'receipts'
}

// Helper function to get user ID
export const getUserId = async () => {
  try {
    const user = await account.get()
    return user.$id
  } catch (error) {
    console.error('Error getting user ID:', error)
    return null
  }
}