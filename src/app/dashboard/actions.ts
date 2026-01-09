"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const userId = session.user.id

    const personalProjectsCount = await prisma.project.count({
        where: {
            ownerId: userId,
            organizationId: null
        }
    })

    const organizationalProjectsCount = await prisma.project.count({
        where: {
            OR: [
                { ownerId: userId, organizationId: { not: null } },
                { members: { some: { userId: userId } }, organizationId: { not: null } }
            ]
        }
    })

    return {
        personalProjectsCount,
        organizationalProjectsCount
    }
}
