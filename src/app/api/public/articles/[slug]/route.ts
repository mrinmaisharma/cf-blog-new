import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true, bio: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  }); 

  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}
