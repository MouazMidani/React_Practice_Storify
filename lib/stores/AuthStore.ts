import { create } from "zustand"
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

type Status = "idle" | "loading" | "authenticated" | "unauthenticated"

interface User {
    $id: string
    fullName: string
    email: string
    avatar: string
    accountId: string
}

interface AuthState {
    status: Status
    user: User | null
    sessionId: string | null
    accountId: string | null
    
    // Actions
    setStatus: (status: Status) => void
    setSession: (sessionId: string, accountId: string) => void
    setUser: (user: User) => void
    clearAuth: () => void
    
    // Persistence actions
    hydrate: () => Promise<void>
}

const AUTH_STORAGE_KEY = 'auth-state'
const isNative = Platform.OS === 'ios' || Platform.OS === 'android'

export const AuthStore = create<AuthState>((set, get) => ({
    status: "idle",
    user: null,
    sessionId: null,
    accountId: null,
    
    setStatus: (status) => {
        set({ status })
        saveAuthState(get())
    },
    
    setSession: (sessionId, accountId) => {
        set({ sessionId, accountId, status: "authenticated" })
        saveAuthState(get())
    },
    
    setUser: (user) => {
        set({ user })
        saveAuthState(get())
    },
    
    clearAuth: () => {
        set({ 
            status: "unauthenticated", 
            user: null, 
            sessionId: null, 
            accountId: null 
        })
        clearAuthState()
    },
    
    hydrate: async () => {
        try {
            const stored = await loadAuthState()
            if (stored) {
                set(stored)
            }
        } catch (error) {
            console.error('Failed to hydrate auth state:', error)
        }
    }
}))

// Helper functions for persistence
const saveAuthState = async (state: AuthState) => {
    try {
        const { status, user, sessionId, accountId } = state
        const data = JSON.stringify({ status, user, sessionId, accountId })
        
        if (isNative) {
            await SecureStore.setItemAsync(AUTH_STORAGE_KEY, data)
        } else {
            localStorage.setItem(AUTH_STORAGE_KEY, data)
        }
    } catch (error) {
        console.error('Failed to save auth state:', error)
    }
}

const loadAuthState = async (): Promise<Partial<AuthState> | null> => {
    try {
        let data: string | null
        
        if (isNative) {
            data = await SecureStore.getItemAsync(AUTH_STORAGE_KEY)
        } else {
            data = localStorage.getItem(AUTH_STORAGE_KEY)
        }
        
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error('Failed to load auth state:', error)
        return null
    }
}

const clearAuthState = async () => {
    try {
        if (isNative) {
            await SecureStore.deleteItemAsync(AUTH_STORAGE_KEY)
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY)
        }
    } catch (error) {
        console.error('Failed to clear auth state:', error)
    }
}