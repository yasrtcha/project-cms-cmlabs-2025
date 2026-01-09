import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, generateShortId } from "@/lib/utils/slug"

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

    const projects = await prisma.project.findMany({
      where: { organizationId: organization.id },
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
    })

    const projectsWithRole = projects.map(project => {
      const membership = project.members.find(m => m.userId === session.user.id)
      return { ...project, userRole: membership?.role || null }
    })

    return NextResponse.json({ success: true, data: projectsWithRole })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
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

    const body = await request.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Project name is required" }, { status: 400 })
    }

    // Generate unique slug
    let slug = generateSlug(body.name)
    let slugExists = await prisma.project.findFirst({
      where: { organizationId: organization.id, slug }
    })
    while (slugExists) {
      slug = generateSlug(body.name) + "-" + Math.random().toString(36).substring(2, 6)
      slugExists = await prisma.project.findFirst({
        where: { organizationId: organization.id, slug }
      })
    }

    // Generate unique shortId (6 characters)
    const shortId = generateShortId()

    // Get Super Admin role
    const superAdminRole = await prisma.role.findFirst({
      where: { slug: "super-admin", projectId: null }
    })

    if (!superAdminRole) {
      return NextResponse.json({ success: false, error: "Default roles not found. Run db:seed first." }, { status: 500 })
    }

    const project = await prisma.project.create({
      data: {
        name: body.name.trim(),
        slug,
        shortId, // This requires prisma db push && prisma generate first
        description: body.description || null,
        status: "progress",
        ownerId: session.user.id,
        organizationId: organization.id,
        members: {
          create: {
            userId: session.user.id,
            roleId: superAdminRole.id,
            status: "active"
          }
        }
      } as any,
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, image: true } },
            role: { select: { id: true, name: true, slug: true, color: true } }
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}
