"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import { ArrowLeft } from "lucide-react"

export default function ResetSuccessPage() {
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        {/* Success Icon/Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Your password has been successfully reset
          </h1>
          <p className="text-gray-600 mt-3">
            You can log in with your new password. If you encounter any issues, please contact support.!
          </p>
        </div>

        {/* Login Button */}
        <Button
          onClick={() => window.location.href = '/auth/login'}
          className="w-full bg-[#0D5EBA] hover:bg-[#0A4A94] text-white py-3 rounded-lg font-medium transition-colors"
        >
          Login Now
        </Button>

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
