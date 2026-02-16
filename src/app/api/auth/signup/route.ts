import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

export async function POST(req: Request) {
    console.log("DEBUG: Received signup request");
  let body = await req.json();
  const parsed = schema.safeParse(body);
  console.log("DEBUG: Parsed body", parsed);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const hash = await bcrypt.hash(password, 12);

  const username = slugify(name, { lower: true, strict: true, trim: true });

  await prisma.user.create({
    data: { name, email, password: hash, username },
  });

  return NextResponse.json({ ok: true });
}
