import { useCallback } from "react"
import { Platform } from "react-native"
import { Appwrite, AppwriteAdmin } from "../stores/AppwriteStore"
import { AuthStore } from "../stores/AuthStore"
import { useUploadStore } from "../stores/UploadStore"
import { getFileCategory, parseStringify } from "../util"
import { useQueryStore } from "../stores/QueryStore"
import {  Query } from "react-native-appwrite"
import { appwriteConfig } from "../appwrite/config"
import { getCurrentUser } from "./userHook"
const ID = Platform.OS === "web" ? require("appwrite").ID : require("react-native-appwrite").ID

interface UploadItem {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "completed" | "error"
  file: any
}

export function useAppwriteUpload() {
  const { storage, databases, account } = Appwrite.getState()
  const { user } = AuthStore.getState()
  const { addUploads, updateProgress, markComplete, removeUpload } = useUploadStore()
  const bucketId = process.env.EXPO_PUBLIC_APPWRITE_BUCKET!
  const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE!
  const collectionId = process.env.EXPO_PUBLIC_APPWRITE_FILES_COLLECTION!

  const uploadFile = useCallback(
    async (file: File | { uri: string; name: string; type: string; size: number }) => {
      
      // Check if user has an active session
      let currentAccount
      try {
        currentAccount = await account.get()
      } catch (error: any) {
        throw new Error("You must be logged in to upload files. Please log in first.")
      }

      const uploadId = Math.random().toString(36).slice(2, 9)
      const fileName = file.name
      const fileSize = file.size
      const fileType = file.type

      const newUpload: UploadItem = {
        id: uploadId,
        name: fileName,
        size: fileSize,
        progress: 0,
        status: "uploading",
        file: file as any,
      }

      addUploads([newUpload])

      try {
        let uploaded

        if (Platform.OS === "web") {
          // Web SDK - positional parameters
          uploaded = await storage.createFile(
            bucketId,
            ID.unique(),
            file as File
          )
          updateProgress(uploadId, 100)
        } else {
          const nativeFile = file as { uri: string; name: string; type: string; size: number };
          
          uploaded = await storage.createFile(
            bucketId,
            ID.unique(),
            {
              uri: nativeFile.uri,
              name: nativeFile.name,
              type: nativeFile.type,
            },
            (progressEvent: any) => {
              if (progressEvent.loaded && progressEvent.total) {
                const progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
                updateProgress(uploadId, progress)
              }
            }
          )  
        }

        const fileUrl = storage.getFileView(bucketId, uploaded.$id)
        const fileCategory = getFileCategory(fileType)
        const ownerId = currentAccount.$id
        const ownerValue = user?.$id
        console.log("-> user: ", user)

        try {
          await databases.createDocument(
            databaseId, 
            collectionId, 
            ID.unique(), 
            {
              name: fileName,
              url: fileUrl.toString(),
              type: fileCategory,
              extension: fileName.split(".").pop(),
              size: fileSize,
              bucketField: bucketId,
              accountId: ownerId,
              owner: ownerValue, 
              users: [ownerValue],
            }
          )

        } catch (dbError: any) {
          console.error("Database error details:", {
            message: dbError.message,
            code: dbError.code,
            type: dbError.type,
          })
          throw dbError
        }

        markComplete(uploadId)
        setTimeout(() => removeUpload(uploadId), 2500)
        return uploaded
      } catch (error: any) {
        updateProgress(uploadId, 100)
        removeUpload(uploadId)
        throw error
      }
    },
    [
      addUploads,
      updateProgress,
      markComplete,
      removeUpload,
      storage,
      databases,
      account,
      user,
      bucketId,
      databaseId,
      collectionId,
    ]
  )

  const uploadMultiple = useCallback(
    async (files: FileList | Array<{ uri: string; name: string; type: string; size: number }>) => {
      const uploads = Array.from(files as []).map((file) => uploadFile(file))
      await Promise.all(uploads)
    },
    [uploadFile]
  )

  return { uploadFile, uploadMultiple, getFiles }
}

export const getFiles = async () => {
  const { databases, account } = AppwriteAdmin.getState()
  let currentUser
  try {
    const accountData = await account.get()  // throws if no session
    currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountData.$id)],
    ).then(res => res.documents[0])
    
    if (!currentUser) throw new Error("User not found")
  } catch (err) {
    console.error("No valid session. Please log in first.", err)
    throw err
  }  
  const files = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollectionId,
    useQueryStore.getState().queries
  )

  return parseStringify(files)
}

export const renameFile = async (fileId: string, newName: string) => {
  const { databases, account } = AppwriteAdmin.getState()

  try {
    const accountData = await account.get()
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountData.$id)],
    ).then(res => res.documents[0])
    
    if (!currentUser) throw new Error("User not found")

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )

    if (file.owner !== currentUser.$id)
      throw new Error("You don't have permission to rename this file")

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { name: newName }
    )

    return parseStringify(updatedFile)
  } catch (err) {
    console.error("Error renaming file:", err)
    throw err
  }
}

export function extractFileId(url: string): string | null {
  const match = url.match(/\/files\/([^\/]+)\//);
  return match ? match[1] : null;
}

export const deleteFile = async (fileId: string) => {
  const { databases, storage, account } = AppwriteAdmin.getState()

  try {
    const accountData = await account.get()
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountData.$id)],
    ).then(res => res.documents[0])
    
    if (!currentUser) throw new Error("User not found")

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )
    const bucketFileId = extractFileId(file.url)
    if (file.owner !== currentUser.$id) {
      throw new Error("You don't have permission to delete this file")
    }

    const deleteFile = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )
    if(deleteFile){
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId)
    }
    return { success: true, message: "File deleted successfully" }
  } catch (err) {
    console.error("Error deleting file:", err)
    throw err
  }
}

export const shareFile = async (fileId: string, userEmails: string[]) => {
  const { databases, account } = AppwriteAdmin.getState()

  try {
    const accountData = await account.get()
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountData.$id)],
    ).then(res => res.documents[0])
    
    if (!currentUser) throw new Error("User not found")

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )

    if (file.owner !== currentUser.$id) {
      throw new Error("You don't have permission to share this file")
    }

    const sharedUserIds = await Promise.all(
      userEmails.map(async (email) => {
        const users = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.usersCollectionId,
          [Query.equal("email", email)]
        )
        return users.documents[0]?.$id
      })
    )

    const validUserIds = sharedUserIds.filter(id => id !== undefined)

    if (validUserIds.length === 0) {
      throw new Error("No valid users found to share with")
    }

    const existingUsers = file.users || []
    const updatedUsers = [...new Set([...existingUsers, ...validUserIds])]

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: updatedUsers }
    )

    return parseStringify(updatedFile)
  } catch (err) {
    console.error("Error sharing file:", err)
    throw err
  }
}

export const unshareFile = async (fileId: string, userIds: string[]) => {
  const { databases, account } = AppwriteAdmin.getState()

  try {
    const accountData = await account.get()
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", accountData.$id)],
    ).then(res => res.documents[0])
    
    if (!currentUser) throw new Error("User not found")

    const file = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId
    )

    if (file.owner !== currentUser.$id) {
      throw new Error("You don't have permission to unshare this file")
    }

    const existingUsers = file.users || []
    const updatedUsers = existingUsers.filter(
      (userId: string) => !userIds.includes(userId)
    )

    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      { users: updatedUsers }
    )

    return parseStringify(updatedFile)
  } catch (err) {
    console.error("Error unsharing file:", err)
    throw err
  }
}