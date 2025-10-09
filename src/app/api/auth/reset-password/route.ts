import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token dan password harus diisi" },
        { status: 400 }
      )
    }

    // Hash the token to compare with database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: "Token tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Delete used token
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    })

    return NextResponse.json(
      { message: "Password berhasil direset" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat reset password" },
      { status: 500 }
    )
  }
}
