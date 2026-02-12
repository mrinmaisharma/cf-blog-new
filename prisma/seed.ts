import { PrismaClient } from "@/generated/prisma";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const parsedDatabaseUrl = new URL(databaseUrl);

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: parsedDatabaseUrl.hostname,
    port: parsedDatabaseUrl.port ? Number(parsedDatabaseUrl.port) : 3306,
    user: decodeURIComponent(parsedDatabaseUrl.username),
    password: decodeURIComponent(parsedDatabaseUrl.password),
    database: parsedDatabaseUrl.pathname.replace(/^\//, "") || undefined,
  }),
});

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
