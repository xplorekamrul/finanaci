"use server";

import { hashPassword } from "@/lib/hash";
import { sendWelcomeEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action/clients";
import { registerSchema } from "@/lib/validations/auth";
import { Role } from "@prisma/client";

export const register = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput }) => {
    const { name, email, password, username } = parsedInput;

    // Combine email and username check into single query
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      },
      select: { email: true, username: true }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return { ok: false as const, message: "Email already registered" };
      }
      return { ok: false as const, message: "Username already taken" };
    }

    let role: Role = Role.ADMIN;
    if (email === (process.env.SUPERADMIN_EMAIL ?? "").toLowerCase().trim()) {
      role = Role.SUPER_ADMIN;
    } else if (email === (process.env.DEVELOPER_EMAIL ?? "").toLowerCase().trim()) {
      role = Role.DEVELOPER;
    }

    const pwd = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, username, password: pwd, role },
      select: { id: true, email: true, role: true, name: true, username: true },
    });

    // Send welcome email (fire and forget to not block response)
    void sendWelcomeEmail(user.email, user.name ?? "User");

    return { ok: true as const, user };
  });
