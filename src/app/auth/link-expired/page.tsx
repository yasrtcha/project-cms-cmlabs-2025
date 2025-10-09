"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function LinkExpiredPage() {
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        {/* Error Icon/Image */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Link Expired</h1>
          <p className="text-gray-600 mt-3">
            The password reset link has expired. Please request a new link to reset your password.
          </p>
        </div>

        {/* Back to Login Button */}
        <Button
          onClick={() => window.location.href = '/auth/forgot-password'}
          className="w-full bg-[#0D5EBA] hover:bg-[#0A4A94] text-white py-3 rounded-lg font-medium transition-colors"
        >
          Back to login
        </Button>
      </div>
    </AuthLayout>
  )
}
