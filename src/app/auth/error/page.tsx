"use client";
export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const errorMessages: Record<string, string> = {
  Configuration: "Terjadi kesalahan konfigurasi server.",
  AccessDenied: "Akses ditolak. Anda tidak memiliki izin untuk mengakses halaman ini.",
  Verification: "Token verifikasi tidak valid atau sudah kadaluarsa.",
  Default: "Terjadi kesalahan saat login. Silakan coba lagi.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorMessage = error && errorMessages[error] 
    ? errorMessages[error] 
    : errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-red-600">
            Error Authentication
          </CardTitle>
          <CardDescription className="text-center">
            Terjadi kesalahan saat proses autentikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm text-center">
            {errorMessage}
          </div>
          
          <Button
            asChild
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Link href="/auth/login">
              Kembali ke Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
