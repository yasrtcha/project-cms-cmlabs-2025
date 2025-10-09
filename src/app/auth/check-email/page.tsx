"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ArrowLeft } from "lucide-react"

export default function CheckEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check your email</h1>
          <p className="text-gray-600 mt-2">
            We sent a password reset link to <span className="font-semibold text-gray-900">({email})</span> which is valid for 24 hours after receives the email. Please check your inbox!
          </p>
        </div>

        {/* Open Gmail Button */}
        <Button
          onClick={() => window.open('https://mail.google.com', '_blank')}
          className="w-full bg-[#0D5EBA] hover:bg-[#0A4A94] text-white py-3 rounded-lg font-medium transition-colors"
        >
          Open Gmail
        </Button>

        {/* Resend Email */}
        <p className="text-sm text-gray-600 text-center">
          Don't receive the email?{" "}
          <Link href="/auth/forgot-password" className="text-[#0D5EBA] hover:text-[#0A4A94] font-semibold">
            Click here to resend
          </Link>
        </p>

        {/* Back to Login */}
        <Link 
          href="/auth/login" 
          className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to log in
        </Link>
      </div>
    </AuthLayout>
  )
}
