import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')
    // Contoh: Menambahkan plan default
    // Pastikan model "Plan" sudah ada di schema.prisma Anda
    /*
    await prisma.plan.upsert({
      where: { id: 'free' },
      update: {},
      create: { id: 'free', name: 'Free Plan', customDomainLimit: 0 }
    })
    */
    console.log('Seeding finished.')
}

main()
    .then(async () => { await prisma.$disconnect() })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })