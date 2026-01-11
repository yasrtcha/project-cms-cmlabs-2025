import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findFirst({
      where: {
        AND: [
          { OR: [{ id }, { slug: id }] },
          {
            OR: [
              { ownerId: session.user.id },
              { members: { some: { userId: session.user.id, status: "active" } } }
            ]
          }
        ]
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
          orderBy: { invitedAt: "desc" }
        },
        projects: {
          include: {
            _count: { select: { members: true } },
            members: {
              include: {
                user: { select: { id: true, name: true, email: true, image: true } },
                role: { select: { id: true, name: true, slug: true, color: true } }
              },
              take: 5
            }
          },
          orderBy: { updatedAt: "desc" }
        },
        _count: { select: { members: true, projects: true } }
      }
    })

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 })
    }

    const isOwner = organization.ownerId === session.user.id
    return NextResponse.json({
      success: true,
      data: { ...organization, userRole: isOwner ? "super-admin" : "collaborator" }
    })
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch organization" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findFirst({
      where: { OR: [{ id }, { slug: id }], ownerId: session.user.id }
    })

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found or no permission" }, { status: 404 })
    }

    const body = await request.json()
    const updated = await prisma.organization.update({
      where: { id: organization.id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description })
      }
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json({ success: false, error: "Failed to update organization" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findFirst({
      where: { OR: [{ id }, { slug: id }], ownerId: session.user.id }
    })

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found or no permission" }, { status: 404 })
    }

    await prisma.organization.delete({ where: { id: organization.id } })
    return NextResponse.json({ success: true, message: "Organization deleted" })
  } catch (error) {
    console.error("Error deleting organization:", error)
    return NextResponse.json({ success: false, error: "Failed to delete organization" }, { status: 500 })
  }
}
