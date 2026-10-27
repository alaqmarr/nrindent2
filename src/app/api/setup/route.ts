import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      isLocked: userCount > 0,
      userCount,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to check setup status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Hard server-side lock check: reject if any user already exists
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          error:
            "Setup is locked. An administrator account has already been created.",
          isLocked: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email address, and password are required." },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role: "ADMIN",
        phone: phone ? String(phone).trim() : null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      isLocked: true,
      user,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create initial admin account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
