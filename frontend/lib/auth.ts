/**
 * Better Auth configuration for JWT-based authentication
 */

import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

export const auth = betterAuth({
  // Database configuration - Better Auth uses backend API
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL || "",
  },

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Will be enabled in production
  },

  // JWT configuration to match backend
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (matches backend)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache for 5 minutes
    },
  },

  // Advanced configuration
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookieSameSite: "lax",
    generateId: () => {
      // Generate user ID compatible with backend
      return `user_${Math.random().toString(36).substring(2, 15)}`
    },
  },

  // Social authentication (for future use)
  socialProviders: {
    google: {
      enabled: false,
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      enabled: false,
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },

  // Use Next.js cookies adapter
  plugins: [nextCookies()],
})

/**
 * Token storage helper (client-side only)
 */
const TOKEN_KEY = 'auth_token'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

function setToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

function removeToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Custom auth client for API calls to backend
 */
export const authClient = {
  /**
   * Sign up a new user
   */
  async signup(email: string, password: string, name?: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Signup failed")
    }

    const data = await response.json()
    // Store the JWT token
    if (data.access_token) {
      setToken(data.access_token)
    }
    return data
  },

  /**
   * Sign in an existing user
   */
  async signin(email: string, password: string) {
    const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Signin failed")
    }

    const data = await response.json()
    // Store the JWT token
    if (data.access_token) {
      setToken(data.access_token)
    }
    return data
  },

  /**
   * Sign out the current user
   */
  async signout() {
    const token = getToken()
    const response = await fetch(`${BACKEND_URL}/api/auth/signout`, {
      method: "POST",
      headers: token ? {
        "Authorization": `Bearer ${token}`,
      } : {},
      credentials: "include",
    })

    // Remove token regardless of response
    removeToken()

    if (!response.ok) {
      throw new Error("Signout failed")
    }

    return response.json()
  },

  /**
   * Get the current user session
   */
  async getSession() {
    const token = getToken()

    if (!token) {
      return null
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    })

    if (!response.ok) {
      // Token might be expired or invalid
      if (response.status === 401 || response.status === 403) {
        removeToken()
      }
      return null
    }

    return response.json()
  },

  /**
   * Get the stored token
   */
  getToken,

  /**
   * Remove the stored token
   */
  removeToken,
}

export type AuthClient = typeof authClient
