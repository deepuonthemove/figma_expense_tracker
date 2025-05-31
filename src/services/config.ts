import { Client, Account, Databases, Storage } from 'appwrite'

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('682b0a6c0038c8da39e2') // Replace with your project ID

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client) 