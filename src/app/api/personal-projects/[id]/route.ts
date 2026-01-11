import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Get single personal project
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id,
        organizationId: null,
        ownerId: session.user.id
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            role: { select: { id: true, name: true, slug: true, color: true } }
          }
        },
        _count: { select: { members: true, builderContentTypes: true } }
      }
    })

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch project" }, { status: 500 })
  }
}

// PUT - Update personal project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Check ownership
    const existing = await prisma.project.findFirst({
      where: { id, organizationId: null, ownerId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found or access denied" }, { status: 404 })
    }

    const body = await request.json()
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name.trim()
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.customDomain !== undefined) updateData.customDomain = body.customDomain

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, builderContentTypes: true } }
      }
    })

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 })
  }
}

// DELETE - Delete personal project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Check ownership
    const existing = await prisma.project.findFirst({
      where: { id, organizationId: null, ownerId: session.user.id }
    })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Project not found or access denied" }, { status: 404 })
    }

    await prisma.project.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 })
  }
}
