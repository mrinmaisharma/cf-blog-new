import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // next step
import { makeSlug } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title } = await req.json();

  const base = makeSlug(title ?? "Untitled");
  let slug = base;
  let i = 1;
  while (await prisma.article.findUnique({ where: { slug } })) {
    i += 1;
    slug = `${base}-${i}`;
  }

  const article = await prisma.article.create({
    data: {
      title: title ?? "Untitled",
      slug,
      content: { type: "doc", content: [] },
      authorId: user.id,
      published: false,
    },
  });

  return NextResponse.json(article);
}

