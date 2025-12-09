import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { AddProjectMemberInput } from "@/types/organization"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id]/members - List project members
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

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    // Check if user has access to this project
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
      }
    })

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      )
    }

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: project.id,
        ...(search && {
          user: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } }
            ]
          }
        })
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        },
        role: {
          select: { id: true, name: true, slug: true, color: true }
        }
      },
      orderBy: { addedAt: "desc" }
    })

    return NextResponse.json({
      success: true,
      data: members
    })
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/members - Add member to project
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user has permission (owner or super-admin)
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

    const body: AddProjectMemberInput = await request.json()

    if (!body.userId || !body.roleId) {
      return NextResponse.json(
        { success: false, error: "User ID and Role ID are required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: body.userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: body.roleId }
    })

    if (!role) {
      return NextResponse.json(
        { success: false, error: "Role not found" },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: project.id,
          userId: body.userId
        }
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { success: false, error: "User is already a member of this project" },
        { status: 400 }
      )
    }

    // Create member
    const member = await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: body.userId,
        roleId: body.roleId,
        status: "active"
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        },
        role: {
          select: { id: true, name: true, slug: true, color: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: member,
      message: "Member added successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Error adding project member:", error)
    return NextResponse.json(
      { success: false, error: "Failed to add member" },
      { status: 500 }
    )
  }
}
