import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string; userId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    const { id, userId } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const organization = await prisma.organization.findFirst({
      where: { OR: [{ id }, { slug: id }], ownerId: session.user.id }
    })

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found or no permission" }, { status: 404 })
    }

    if (userId === organization.ownerId) {
      return NextResponse.json({ success: false, error: "Cannot remove the owner" }, { status: 400 })
    }

    const member = await prisma.organizationMember.findFirst({
      where: { organizationId: organization.id, userId }
    })

    if (!member) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 })
    }

    await prisma.organizationMember.delete({ where: { id: member.id } })
    return NextResponse.json({ success: true, message: "Member removed" })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ success: false, error: "Failed to remove member" }, { status: 500 })
  }
}
