/**
 * Landing page - redirects to signup or signin
 */

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold tracking-tight text-gray-900">
            Naz Todo
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your intelligent task management companion
          </p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Naz Todo</CardTitle>
            <CardDescription className="text-base">
              Manage your tasks efficiently with AI-powered assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/signup" className="block">
                <Button className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/signin" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid gap-6 text-left sm:grid-cols-3">
              <div className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Task Management</h3>
                <p className="text-sm text-gray-600">
                  Create, organize, and track your tasks with ease
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Smart Completion</h3>
                <p className="text-sm text-gray-600">
                  Mark tasks complete and track your progress
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-600">
                  Get help managing tasks with AI-powered chat (Coming Soon)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500">
          Phase II: Web Application with Authentication
        </p>
      </div>
    </div>
  )
}
