import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PUT(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Password lama dan baru harus diisi" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password baru minimal 6 karakter" },
        { status: 400 }
      )
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User tidak ditemukan atau tidak menggunakan password" },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: "Password lama tidak sesuai" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json(
      { message: "Password berhasil diubah" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengubah password" },
      { status: 500 }
    )
  }
}
