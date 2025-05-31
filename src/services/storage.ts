import { ID } from 'appwrite'
import { storage, BUCKETS } from '../config/appwrite'

export const storageService = {
  async uploadFile(file: File) {
    try {
      const response = await storage.createFile(
        BUCKETS.RECEIPTS,
        ID.unique(),
        file
      )
      return response
    } catch (error) {
      console.error('Upload file error:', error)
      throw error
    }
  },

  async getFileUrl(fileId: string) {
    try {
      return storage.getFileView(BUCKETS.RECEIPTS, fileId)
    } catch (error) {
      console.error('Get file URL error:', error)
      throw error
    }
  },

  async deleteFile(fileId: string) {
    try {
      await storage.deleteFile(BUCKETS.RECEIPTS, fileId)
    } catch (error) {
      console.error('Delete file error:', error)
      throw error
    }
  }
} 