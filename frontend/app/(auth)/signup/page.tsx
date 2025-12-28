/**
 * Signup page for new user registration
 */

import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Sign Up - Naz Todo",
  description: "Create a new account to get started with Naz Todo",
}

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Naz Todo
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Your intelligent task management companion
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Sign up to start managing your tasks efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          By signing up, you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-700">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
