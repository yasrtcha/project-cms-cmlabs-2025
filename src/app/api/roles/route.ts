import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/roles - List available roles
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    // Get global roles and project-specific roles if projectId provided
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { projectId: null }, // Global roles
          ...(projectId ? [{ projectId }] : [])
        ]
      },
      include: {
        permissions: true
      },
      orderBy: { name: "asc" }
    })

    return NextResponse.json({
      success: true,
      data: roles
    })
  } catch (error) {
    console.error("Error fetching roles:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch roles" },
      { status: 500 }
    )
  }
}
