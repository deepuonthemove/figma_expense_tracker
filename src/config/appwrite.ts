import { Client, Account, Databases, Storage } from 'appwrite'
import { 
  APPWRITE_PROJECT_ID, 
  APPWRITE_ENDPOINT, 
  DATABASE_ID, 
  COLLECTIONS, 
  BUCKETS 
} from './appwrite-ids'

// Initialize Appwrite client
// Note: For production, consider using a custom domain as your API endpoint
// to enable secure cookie-based sessions instead of localStorage
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)

// Initialize Appwrite services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)

// Export IDs for use in other files
export { DATABASE_ID, COLLECTIONS, BUCKETS }

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