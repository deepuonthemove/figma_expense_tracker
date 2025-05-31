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
export const DATABASE_ID = '682b0b4f001a20205d2f'
export const COLLECTIONS = {
  EXPENSES: '683aef0a001c42742342',
  USERS: '683aef2600166b2fc24d'
}

// Storage bucket IDs
export const BUCKETS = {
  RECEIPTS: '683af99b00043f287265'
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

// Helper function to get the current origin
export const getCurrentOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NODE_ENV === 'production' 
    ? 'https://figma-expense-tracker-mucp.vercel.app'
    : 'http://localhost:5173'
}