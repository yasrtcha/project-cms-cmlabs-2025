import { PrismaClient, PlanTier } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Seed Roles
    const roles = [
        {
            name: 'Super Admin',
            slug: 'super-admin',
            description: 'Full access to everything',
            color: '#ef4444',
            isSystem: true,
        },
        {
            name: 'Admin',
            slug: 'admin',
            description: 'Project administrative access',
            color: '#f59e0b',
            isSystem: true,
        },
        {
            name: 'Editor',
            slug: 'editor',
            description: 'Can create and edit content',
            color: '#3b82f6',
            isSystem: true,
        },
        {
            name: 'Viewer',
            slug: 'viewer',
            description: 'Can only view content',
            color: '#10b981',
            isSystem: true,
        },
    ]

    for (const role of roles) {
        const existingRole = await prisma.role.findFirst({
            where: {
                slug: role.slug,
                projectId: null,
            },
        })

        if (existingRole) {
            await prisma.role.update({
                where: { id: existingRole.id },
                data: {
                    name: role.name,
                    description: role.description,
                    color: role.color,
                    isSystem: role.isSystem,
                },
            })
        } else {
            await prisma.role.create({
                data: {
                    name: role.name,
                    slug: role.slug,
                    description: role.description,
                    color: role.color,
                    isSystem: role.isSystem,
                    projectId: null,
                },
            })
        }
    }
    console.log('Roles seeded.')

    // 2. Seed Plans
    const plans = [
        {
            name: 'Free',
            tier: PlanTier.FREE,
            description: 'Perfect for getting started',
            price: 0,
            maxPersonalProjects: 1,
            maxOrganizations: 1,
            maxOrgProjects: 1,
            maxTeamMembersPerOrg: 2,
            maxContentEntriesPerProject: 50,
            maxMediaStorageMB: 100,
            supportLevel: 'community',
        },
        {
            name: 'Starter',
            tier: PlanTier.STARTER,
            description: 'For small projects and hobbyists',
            price: 1900, // $19.00
            maxPersonalProjects: 5,
            maxOrganizations: 2,
            maxOrgProjects: 5,
            maxTeamMembersPerOrg: 5,
            maxContentEntriesPerProject: 500,
            maxMediaStorageMB: 1000,
            supportLevel: 'email',
        },
        {
            name: 'Professional',
            tier: PlanTier.PROFESSIONAL,
            description: 'For growing teams and businesses',
            price: 7900, // $79.00
            maxPersonalProjects: 20,
            maxOrganizations: 10,
            maxOrgProjects: 20,
            maxTeamMembersPerOrg: 15,
            maxContentEntriesPerProject: 5000,
            maxMediaStorageMB: 10000,
            hasCustomDomains: true,
            hasLocalization: true,
            supportLevel: 'priority',
        },
        {
            name: 'Enterprise',
            tier: PlanTier.ENTERPRISE,
            description: 'Custom solutions for large organizations',
            price: 29900, // $299.00
            maxPersonalProjects: null,
            maxOrganizations: null,
            maxOrgProjects: null,
            maxTeamMembersPerOrg: null,
            maxContentEntriesPerProject: null,
            maxMediaStorageMB: null,
            hasCustomDomains: true,
            hasLocalization: true,
            hasWhiteLabel: true,
            supportLevel: 'dedicated',
        },
    ]

    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { tier: plan.tier },
            update: plan,
            create: plan,
        })
    }
    console.log('Plans seeded.')

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })