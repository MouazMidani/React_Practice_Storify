import { Platform } from "react-native"
import { appwriteConfig } from "../appwrite/config"
import { create } from "zustand"

let Client: any, Account: any, Databases: any, Storage: any, Avatars: any

if (Platform.OS === "web") {
  const appwrite = require("appwrite")
  Client = appwrite.Client
  Account = appwrite.Account
  Databases = appwrite.Databases
  Storage = appwrite.Storage
  Avatars = appwrite.Avatars
} else {
  const appwrite = require("react-native-appwrite")
  Client = appwrite.Client
  Account = appwrite.Account
  Databases = appwrite.Databases
  Storage = appwrite.Storage
  Avatars = appwrite.Avatars
}

interface AppWriteStore {
  client: any
  account: any
  databases: any
  storage: any
  avatars: any
  init: () => void
}

export const Appwrite = create<AppWriteStore>((set) => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL)
    .setProject(appwriteConfig.projectId)

  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const avatars = new Avatars(client)

  return {
    client,
    account,
    databases,
    storage,
    avatars,
    init: () => set({ client, account, databases, storage, avatars }),
  }
})

export const AppwriteAdmin = create<AppWriteStore>((set) => {
  console.warn(
    "AppwriteAdmin: API keys should not be used in client-side applications. " +
    "This should only be used in server-side/backend code."
  )

  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL)
    .setProject(appwriteConfig.projectId)

  const account = new Account(client)
  const databases = new Databases(client)
  const storage = new Storage(client)
  const avatars = new Avatars(client)

  return {
    client,
    account,
    databases,
    storage,
    avatars,
    init: () => set({ client, account, databases, storage, avatars }),
  }
})