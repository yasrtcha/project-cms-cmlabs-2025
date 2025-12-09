import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, generateShortId } from "@/lib/utils/slug"

// POST - Duplicate organizational project to personal
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { sourceProjectId } = body

    if (!sourceProjectId) {
      return NextResponse.json({ success: false, error: "Source project ID is required" }, { status: 400 })
    }

    // Get source project
    const sourceProject = await prisma.project.findFirst({
      where: {
        id: sourceProjectId,
        OR: [
          { ownerId: session.user.id },
          { members: { some: { userId: session.user.id, status: "active" } } }
        ]
      }
    })

    if (!sourceProject) {
      return NextResponse.json({ success: false, error: "Source project not found or access denied" }, { status: 404 })
    }

    // Generate unique slug for personal project
    const baseName = `${sourceProject.name} (Personal Copy)`
    let slug = generateSlug(baseName)
    let slugExists = await prisma.project.findFirst({
      where: { organizationId: null, ownerId: session.user.id, slug }
    })
    while (slugExists) {
      slug = generateSlug(baseName) + "-" + Math.random().toString(36).substring(2, 6)
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

    // Create personal project copy
    const newProject = await prisma.project.create({
      data: {
        name: baseName,
        slug,
        shortId,
        description: sourceProject.description,
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

    return NextResponse.json({ 
      success: true, 
      data: newProject,
      message: "Project duplicated to personal successfully"
    }, { status: 201 })
  } catch (error) {
    console.error("Error duplicating project:", error)
    return NextResponse.json({ success: false, error: "Failed to duplicate project" }, { status: 500 })
  }
}
