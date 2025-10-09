import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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
    const { name, email, company, jobTitle, country } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name dan email harus diisi" },
        { status: 400 }
      )
    }

    // Check if email already exists (for different user)
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Email sudah digunakan oleh user lain" },
        { status: 400 }
      )
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        company: company || null,
        jobTitle: jobTitle || null,
        country: country || null
      }
    })

    return NextResponse.json(
      { 
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email
        },
        message: "Profil berhasil diupdate" 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat update profil" },
      { status: 500 }
    )
  }
}
