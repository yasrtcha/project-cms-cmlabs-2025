import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, generateShortId } from "@/lib/utils/slug"

// GET - List personal projects (projects without organization)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const projects = await prisma.project.findMany({
      where: {
        organizationId: null, // Personal projects have no organization
        ownerId: session.user.id,
        ...(search && {
          name: { contains: search, mode: "insensitive" as const }
        })
      },
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, contentTypes: true } }
      },
      orderBy: { updatedAt: "desc" }
    })

    return NextResponse.json({ success: true, data: projects })
  } catch (error) {
    console.error("Error fetching personal projects:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch projects" }, { status: 500 })
  }
}

// POST - Create personal project
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Project name is required" }, { status: 400 })
    }

    // Generate unique slug for personal projects
    let slug = generateSlug(body.name)
    let slugExists = await prisma.project.findFirst({
      where: { organizationId: null, ownerId: session.user.id, slug }
    })
    while (slugExists) {
      slug = generateSlug(body.name) + "-" + Math.random().toString(36).substring(2, 6)
      slugExists = await prisma.project.findFirst({
        where: { organizationId: null, ownerId: session.user.id, slug }
      })
    }

    // Generate unique shortId
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
        shortId,
        description: body.description || null,
        status: "progress",
        ownerId: session.user.id,
        organizationId: null, // Personal project
        members: {
          create: {
            userId: session.user.id,
            roleId: superAdminRole.id,
            status: "active"
          }
        }
      } as any,
      include: {
        owner: { select: { id: true, name: true, email: true, image: true } },
        _count: { select: { members: true, contentTypes: true } }
      }
    })

    return NextResponse.json({ success: true, data: project }, { status: 201 })
  } catch (error) {
    console.error("Error creating personal project:", error)
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 })
  }
}
