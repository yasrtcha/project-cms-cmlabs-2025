import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { UpdateProjectInput } from "@/types/organization"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get project details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const project = await prisma.project.findFirst({
      where: {
        AND: [
          { OR: [{ id }, { slug: id }] },
          {
            OR: [
              { ownerId: session.user.id },
              { members: { some: { userId: session.user.id, status: "active" } } },
              { organization: { members: { some: { userId: session.user.id, status: "active" } } } }
            ]
          }
        ]
      },
      include: {
        owner: {
          select: { id: true, name: true, email: true, image: true }
        },
        organization: {
          select: { id: true, name: true, slug: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true }
            },
            role: {
              select: { id: true, name: true, slug: true, color: true }
            }
          }
        },
        _count: {
          select: { members: true, contentTypes: true }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    // Get user's role in this project
    const membership = project.members.find((m: { userId: string }) => m.userId === session.user.id)

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        userRole: membership?.role || null
      }
    })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is owner or has permission
    const project = await prisma.project.findFirst({
      where: {
        AND: [
          { OR: [{ id }, { slug: id }] },
          {
            OR: [
              { ownerId: session.user.id },
              { members: { some: { userId: session.user.id, role: { slug: "super-admin" } } } }
            ]
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or you don't have permission" },
        { status: 404 }
      )
    }

    const body: UpdateProjectInput = await request.json()

    const updated = await prisma.project.update({
      where: { id: project.id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.customDomain !== undefined && { customDomain: body.customDomain })
      },
      include: {
        organization: {
          select: { id: true, name: true, slug: true }
        },
        _count: {
          select: { members: true, contentTypes: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Project updated successfully"
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only owner can delete
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        ownerId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found or you don't have permission" },
        { status: 404 }
      )
    }

    await prisma.project.delete({
      where: { id: project.id }
    })

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    )
  }
}
