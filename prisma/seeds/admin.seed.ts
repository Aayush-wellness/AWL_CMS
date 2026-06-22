import { UserRole } from "@prisma/client";
import prisma from "@root/prisma.js";
import { hashPassword } from "../../src/utils/bcrypt.js";

export async function seedAdmin(): Promise<void> {
  console.log("   → admin");

  const email = "admin@company.com";
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log("     • admin already exists");
    return;
  }

  const passwordHash = await hashPassword("Admin@123");

  await prisma.user.create({
    data: {
      name: "Super Admin",
      email,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });
}