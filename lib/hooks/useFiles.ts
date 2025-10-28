import { useCallback } from "react"
import { Platform } from "react-native"
import { Appwrite, AppwriteAdmin } from "../stores/AppwriteStore"
import { AuthStore } from "../stores/AuthStore"
import { useUploadStore } from "../stores/UploadStore"
import { getFileCategory, parseStringify } from "../util"
import { getCurrentUser } from "./userHook"
import { Models, Query } from "react-native-appwrite"
import { appwriteConfig } from "../appwrite/config"
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
        const ownerValue = user?.$id || ownerId

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

const createQueries = (currentUser: any) => {
  const queries = [
    Query.or([
      Query.equal('owner', [currentUser.$id]),
      Query.contains('users', [currentUser.email]),
    ]),
  ]
    // TODO: search, sort, limits ...
  return queries
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

  const queries = createQueries(currentUser)

  const files = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.filesCollectionId,
    queries
  )

  return parseStringify(files)
}