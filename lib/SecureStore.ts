import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Cross-platform token storage utility
 * - Android/iOS: Uses SecureStore (encrypted Keychain/Keystore)
 * - Web: Uses localStorage
 */

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

export const TokenStorage = {

  async saveToken(token: string): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (isNative) {
        return await SecureStore.getItemAsync(TOKEN_KEY);
      } else {
        return localStorage.getItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  },

  async saveRefreshToken(refreshToken: string): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      if (isNative) {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      } else {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async deleteRefreshToken(): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error deleting refresh token:', error);
      throw error;
    }
  },

  async saveTokens(token: string, refreshToken: string): Promise<void> {
    await Promise.all([
      this.saveToken(token),
      this.saveRefreshToken(refreshToken),
    ]);
  },

  async getTokens(): Promise<{ token: string | null; refreshToken: string | null }> {
    const [token, refreshToken] = await Promise.all([
      this.getToken(),
      this.getRefreshToken(),
    ]);
    return { token, refreshToken };
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      this.deleteToken(),
      this.deleteRefreshToken(),
    ]);
  },
};

/**
 * Custom storage adapter for Zustand persist middleware
 * This makes Zustand work seamlessly across platforms
 */
export const zustandStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (isNative) {
        return await SecureStore.getItemAsync(name);
      } else {
        return localStorage.getItem(name);
      }
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (isNative) {
        await SecureStore.setItemAsync(name, value);
      } else {
        localStorage.setItem(name, value);
      }
    } catch (error) {
      console.error('Error setting item:', error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      if (isNative) {
        await SecureStore.deleteItemAsync(name);
      } else {
        localStorage.removeItem(name);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
};

// Usage examples:

/* 1. Direct token storage (for manual control)
await TokenStorage.saveToken('your-jwt-token');
const token = await TokenStorage.getToken();
await TokenStorage.clearAll();
*/

/* 2. With Zustand persist middleware (recommended for state management)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './tokenStorage';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (token: string, refreshToken: string) => void;
  clearTokens: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      clearTokens: () => set({ token: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
*/