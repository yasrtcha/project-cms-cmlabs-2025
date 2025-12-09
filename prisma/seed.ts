import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Default System Roles dengan Permissions
const defaultRoles = [
  {
    name: 'Super Admin',
    slug: 'super-admin',
    description: 'Full access to all features and settings',
    color: 'blue',
    isSystem: true,
    permissions: {
      content: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      media: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      seo: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      settings: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      users: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      projects: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
    },
  },
  {
    name: 'Admin',
    slug: 'admin',
    description: 'Manage content, media, and users',
    color: 'indigo',
    isSystem: true,
    permissions: {
      content: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      media: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      seo: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      settings: { canCreate: false, canRead: true, canUpdate: true, canDelete: false },
      users: { canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      projects: { canCreate: false, canRead: true, canUpdate: true, canDelete: false },
    },
  },
  {
    name: 'Editor',
    slug: 'editor',
    description: 'Create and edit content, cannot delete',
    color: 'yellow',
    isSystem: true,
    permissions: {
      content: { canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      media: { canCreate: true, canRead: true, canUpdate: true, canDelete: false },
      seo: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      settings: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      users: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      projects: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    },
  },
  {
    name: 'SEO Manager',
    slug: 'seo-manager',
    description: 'Manage SEO settings and view content',
    color: 'green',
    isSystem: true,
    permissions: {
      content: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      media: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      seo: { canCreate: true, canRead: true, canUpdate: true, canDelete: true },
      settings: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      users: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      projects: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    },
  },
  {
    name: 'Viewer',
    slug: 'viewer',
    description: 'Read-only access to content',
    color: 'gray',
    isSystem: true,
    permissions: {
      content: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      media: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      seo: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      settings: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      users: { canCreate: false, canRead: false, canUpdate: false, canDelete: false },
      projects: { canCreate: false, canRead: true, canUpdate: false, canDelete: false },
    },
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Create default roles
  for (const roleData of defaultRoles) {
    const { permissions, ...role } = roleData

    // Check if role already exists
    let createdRole = await prisma.role.findFirst({
      where: {
        slug: role.slug,
        projectId: null,
      },
    })

    if (createdRole) {
      // Update existing role
      createdRole = await prisma.role.update({
        where: { id: createdRole.id },
        data: {
          name: role.name,
          description: role.description,
          color: role.color,
          isSystem: role.isSystem,
        },
      })
      console.log(`🔄 Role updated: ${createdRole.name}`)
    } else {
      // Create new role
      createdRole = await prisma.role.create({
        data: {
          name: role.name,
          slug: role.slug,
          description: role.description,
          color: role.color,
          isSystem: role.isSystem,
          projectId: null,
        },
      })
      console.log(`✅ Role created: ${createdRole.name}`)
    }

    // Create/update permissions for this role
    for (const [module, perms] of Object.entries(permissions)) {
      const existingPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId: createdRole.id,
          module: module,
        },
      })

      if (existingPermission) {
        await prisma.rolePermission.update({
          where: { id: existingPermission.id },
          data: {
            canCreate: perms.canCreate,
            canRead: perms.canRead,
            canUpdate: perms.canUpdate,
            canDelete: perms.canDelete,
          },
        })
      } else {
        await prisma.rolePermission.create({
          data: {
            roleId: createdRole.id,
            module: module,
            canCreate: perms.canCreate,
            canRead: perms.canRead,
            canUpdate: perms.canUpdate,
            canDelete: perms.canDelete,
          },
        })
      }
    }

    console.log(`   📋 Permissions set for ${createdRole.name}`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
