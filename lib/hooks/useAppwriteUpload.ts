import { useCallback } from "react"
import { Platform } from "react-native"
import { Appwrite } from "../stores/AppwriteStore"
import { AuthStore } from "../stores/AuthStore"
import { useUploadStore } from "../stores/UploadStore"
let ID: any
if (Platform.OS === "web") {
  ID = require("appwrite").ID
} else {
  ID = require("react-native-appwrite").ID
}

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
        console.error("Session error:", error)
        throw new Error("You must be logged in to upload files. Please log in first.")
      }

      const uploadId = Math.random().toString(36).slice(2, 9)
      const fileName = Platform.OS === "web" ? (file as File).name : (file as any).name
      const fileSize = Platform.OS === "web" ? (file as File).size : (file as any).size
      const fileType = Platform.OS === "web" ? (file as File).type : (file as any).type

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
                const progress = Math.floor(
                  (progressEvent.loaded / progressEvent.total) * 100
                )
                updateProgress(uploadId, progress)
              }
            }
          )
          
        }

        const fileUrl = storage.getFileView(bucketId, uploaded.$id)

        const getFileCategory = (mimeType: string): string => {
          if (!mimeType) return "other"
          
          if (mimeType.startsWith("image/")) return "image"
          if (mimeType.startsWith("video/")) return "video"
          if (mimeType.startsWith("audio/")) return "audio"
          if (
            mimeType.includes("pdf") ||
            mimeType.includes("document") ||
            mimeType.includes("text") ||
            mimeType.includes("msword") ||
            mimeType.includes("wordprocessingml") ||
            mimeType.includes("spreadsheet") ||
            mimeType.includes("presentation")
          ) return "document"
          
          return "other"
        }

        const fileCategory = getFileCategory(fileType)

        const ownerId = currentAccount.$id

        const ownerValue = user?.$id || ownerId

        try {
          const document = await databases.createDocument(
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
          console.error("Database creation error:", dbError)
          console.error("Error details:", {
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
      const uploads = Array.from(files).map((file) => uploadFile(file))
      await Promise.all(uploads)
    },
    [uploadFile]
  )

  return { uploadFile, uploadMultiple }
}