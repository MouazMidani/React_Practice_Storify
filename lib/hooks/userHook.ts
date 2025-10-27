import { appwriteConfig } from "../appwrite/config"
import { AppwriteAdmin, Appwrite } from "../stores/AppwriteStore"
import { AuthStore } from "../stores/AuthStore"
import { ID, Query } from "react-native-appwrite"
import { parseStringify } from "../util"

const handleError = (error: unknown, msg: string) => {
    console.log("Auth -> ", error, msg)
    throw error
}

const getUserByEmail = async (email: string) => {
    const databases = AppwriteAdmin.getState().databases

    const res = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", email)],
    )

    return res.total > 0 ? res.documents[0] : null
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const account = AppwriteAdmin.getState().account
    AuthStore.getState().setStatus("loading")

    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId
    } catch (error) {
        AuthStore.getState().setStatus("unauthenticated")
        handleError(error, "Failed to send email OTP")
    }
}

export const createAccount = async ({
    fullName,
    email
}: {
    fullName: string
    email: string
}) => {
    try {
        AuthStore.getState().setStatus("loading")
        
        const existingUser = await getUserByEmail(email)
        const accountId = await sendEmailOTP({ email })
        
        if (!accountId) throw new Error("Failed to send OTP")

        if (!existingUser) {
            const databases = AppwriteAdmin.getState().databases
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar: "https://www.svgrepo.com/show/382109/male-avatar-boy-face-man-user-7.svg",
                    accountId
                }
            )
        }

        return parseStringify({ accountId })
    } catch (error) {
        AuthStore.getState().setStatus("unauthenticated")
        handleError(error, "Failed to create account")
    }
}

export const verifySecret = async ({
    accountId,
    password
}: {
    accountId: string
    password: string
}) => {
    try {
        AuthStore.getState().setStatus("loading")
        
        const { account, client } = Appwrite.getState()
        const session = await account.createSession(accountId, password)

        // ✅ SET THE SESSION ON THE CLIENT
        client.setSession(session.secret)

        AuthStore.getState().setSession(session.$id, accountId)

        const user = await getCurrentUser()
        if (user) {
            AuthStore.getState().setUser(user)
        }

        return parseStringify({ sessionId: session.$id })

    } catch (error) {
        AuthStore.getState().setStatus("unauthenticated")
        handleError(error, "Failed to verify OTP")
    }
}

export const getCurrentUser = async () => {
    try {
        const { databases, account } = Appwrite.getState()

        const result = await account.get()

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)],
        )

        if (user.total <= 0) return null

        return parseStringify(user.documents[0])
    } catch (error) {
        console.log(error)
        return null
    }
}

export const signOut = async () => {
    try {
        AuthStore.getState().setStatus("loading")
        
        const account = Appwrite.getState().account
        await account.deleteSession('current')

        AuthStore.getState().clearAuth()

    } catch (error) {
        handleError(error, "Failed to sign out")
    }
}

export const signIn = async ({email}: {email: string}) => {
    try {
        const existingUser = await getUserByEmail(email)

        if(existingUser){
            await sendEmailOTP({email})
            return parseStringify({accountId: existingUser.accountId, })
        }
        return parseStringify({accountId: null, error: "user not found"})
    } catch (error) {
        handleError(error, "User not found")
    }
}

export const initializeAuth = async () => {
    try {
        const { sessionId, accountId } = AuthStore.getState()

        // Check if we have a stored session
        if (sessionId && accountId) {
            AuthStore.getState().setStatus("loading")
            
            // ✅ Try to get the current user (this will verify the session)
            try {
                const user = await getCurrentUser()
                
                if (user) {
                    AuthStore.getState().setUser(user)
                    AuthStore.getState().setStatus("authenticated")
                } else {
                    // Session expired, clear auth
                    AuthStore.getState().clearAuth()
                }
            } catch (error) {
                // Session is invalid
                console.log("Session expired or invalid:", error)
                AuthStore.getState().clearAuth()
            }
        } else {
            AuthStore.getState().setStatus("unauthenticated")
        }
    } catch (error) {
        console.log("Failed to initialize auth:", error)
        AuthStore.getState().clearAuth()
    }
}