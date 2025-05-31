import { ID, Query } from 'appwrite'
import { databases, DATABASE_ID } from '../config/appwrite'

const COLLECTION_ID = 'expenses'

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  userId: string
  receiptUrl?: string
}

export const expenses = {
  async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      expense
    )
    return response as unknown as Expense
  },

  async list(userId: string): Promise<Expense[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId)]
    )
    return response.documents as unknown as Expense[]
  },

  async delete(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
  }
} 