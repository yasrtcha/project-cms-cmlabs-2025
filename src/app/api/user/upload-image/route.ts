import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { revalidatePath } from "next/cache"
import path from "path"

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Please upload JPG, PNG, or GIF" },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 4MB limit" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-')
    const filename = `profile-${session.user.id}-${timestamp}-${originalName}`
    
    // Save to public/uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles")
    const filepath = path.join(uploadDir, filename)

    // Create directory if it doesn't exist
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    await writeFile(filepath, buffer)

    // Generate URL for the image
    const imageUrl = `/uploads/profiles/${filename}`

    // Update user profile image in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl }
    })

    // Revalidate profile page cache
    revalidatePath('/dashboard/profile')

    return NextResponse.json(
      { 
        message: "Profile image uploaded successfully",
        imageUrl: imageUrl,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Upload image error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
