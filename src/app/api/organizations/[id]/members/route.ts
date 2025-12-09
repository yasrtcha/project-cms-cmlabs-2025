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
      }
    })

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 })
    }

    const members = await prisma.organizationMember.findMany({
      where: { organizationId: organization.id },
      include: { user: { select: { id: true, name: true, email: true, image: true } } },
      orderBy: [{ role: "asc" }, { invitedAt: "desc" }]
    })

    return NextResponse.json({ success: true, data: members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
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
    if (!body.email?.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase().trim() }
    })

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const existing = await prisma.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: organization.id, userId: user.id } }
    })

    if (existing) {
      return NextResponse.json({ success: false, error: "User is already a member" }, { status: 400 })
    }

    const member = await prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: user.id,
        role: "collaborator",
        status: "pending"
      },
      include: { user: { select: { id: true, name: true, email: true, image: true } } }
    })

    return NextResponse.json({ success: true, data: member }, { status: 201 })
  } catch (error) {
    console.error("Error inviting member:", error)
    return NextResponse.json({ success: false, error: "Failed to invite member" }, { status: 500 })
  }
}
