
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, generateShortId } from "@/lib/utils/slug"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id, status: "active" } } }
        ]
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: {
          where: { status: "active" },
          include: { user: { select: { id: true, name: true, email: true, image: true } } },
          take: 5
        },
        _count: { select: { members: true, projects: true } }
      },
      orderBy: { updatedAt: "desc" }
    })
    const orgsWithRole = organizations.map(org => ({
      ...org,
      userRole: org.ownerId === session.user.id ? "owner" : "collaborator"
    }))
    return NextResponse.json({ success: true, data: orgsWithRole })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch organizations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Organization name is required" }, { status: 400 })
    }
    
    // Generate unique slug
    let slug = generateSlug(body.name)
    let slugExists = await prisma.organization.findUnique({ where: { slug } })
    while (slugExists) {
      slug = generateSlug(body.name) + "-" + Math.random().toString(36).substring(2, 6)
      slugExists = await prisma.organization.findUnique({ where: { slug } })
    }

    // Generate unique shortId (6 characters)
    const shortId = generateShortId()

    const organization = await prisma.organization.create({
      data: {
        name: body.name.trim(),
        slug,
        shortId, // This requires prisma db push && prisma generate first
        description: body.description || null,
        ownerId: session.user.id,
        members: { create: { userId: session.user.id, role: "owner", status: "active", joinedAt: new Date() } }
      } as any,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        members: { include: { user: { select: { id: true, name: true, email: true, image: true } } } },
        _count: { select: { members: true, projects: true } }
      }
    })
    return NextResponse.json({ success: true, data: organization }, { status: 201 })
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json({ success: false, error: "Failed to create organization" }, { status: 500 })
  }
}
