import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL || "file:./prisma/dev.db";
  const authToken = process.env.LIBSQL_AUTH_TOKEN || undefined;

  // Normalize relative SQLite file URLs so both libsql and prisma CLI resolve to the same db file
  const libsqlUrl =
    url === "file:./dev.db" ? "file:./prisma/dev.db" : url;

  const adapter = new PrismaLibSQL({
    url: libsqlUrl,
    authToken,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
