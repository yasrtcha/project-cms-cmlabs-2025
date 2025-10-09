import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, jobTitle, country, password } = body

    if (!name || !email || !company || !jobTitle || !country || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        company,
        jobTitle,
        country,
        password: hashedPassword,
      }
    })

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        message: "Registrasi berhasil" 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    )
  }
}
