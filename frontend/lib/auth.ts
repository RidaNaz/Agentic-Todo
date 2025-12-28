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

    return response.json()
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

    return response.json()
  },

  /**
   * Sign out the current user
   */
  async signout() {
    const response = await fetch(`${BACKEND_URL}/api/auth/signout`, {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Signout failed")
    }

    return response.json()
  },

  /**
   * Get the current user session
   */
  async getSession() {
    const response = await fetch(`${BACKEND_URL}/api/auth/session`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    return response.json()
  },
}

export type AuthClient = typeof authClient
