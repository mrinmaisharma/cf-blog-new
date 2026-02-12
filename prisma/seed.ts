import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({});

async function main() {
    const passwordHash = await bcrypt.hash("Abcd@123#", 10);

    const existingAdmin = await prisma.user.findUnique({
        where: { email: "devops@arbre.in" },
    });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email: "devops@arbre.in",
        password: passwordHash,
        createdAt: new Date(),
      },
    });
    console.log("✓ Admin user created");
  } else {
    console.log("→ Admin already exists");
  }

}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });