import {PrismaClient} from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const memberPermission = await prisma.permission.upsert({
    where: {name: "site:member"},
    update: {},
    create: {
      name: "site:member",
      description: "Registered member of the site",
    },
  })
  const adminPermission = await prisma.permission.upsert({
    where: {name: "site:admin"},
    update: {},
    create: {
      name: "site:admin",
      description: "Allows access to everything in the site",
    },
  })

  const ben = await prisma.user.upsert({
    where: {email: "ben@example.com"},
    update: {},
    create: {
      email: "ben@example.com",
      username: "ben",
    },
  })

  const scot = await prisma.user.upsert({
    where: {email: "scot@example.com"},
    update: {},
    create: {
      email: "scot@example.com",
      username: "scot",
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
.finally(async () => {
  await prisma.$disconnect()
})
