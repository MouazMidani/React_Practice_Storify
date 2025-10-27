export const appwriteConfig = {
    endpointURL: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE,
    filesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_FILES_COLLECTION,
    bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET,
    usersCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION,
    secretKey: process.env.EXPO_PUBLIC_APPWRITE_SECRET
}