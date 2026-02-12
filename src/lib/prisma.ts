// src/lib/prisma.ts
import { Prisma, PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

export const prisma = new PrismaClient({
  transactionOptions: {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 5000, // default 2000ms
    timeout: 10000, // default 5000ms
  },
}).$extends(withAccelerate());

