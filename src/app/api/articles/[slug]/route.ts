import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, subtitle, content, excerpt, coverImage, published, tags } = await req.json();

  const existing = await prisma.article.findUnique({ where: { slug: params.slug } });
  if (!existing || existing.authorId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Update tags: simple replace strategy
  const tagNames: string[] = Array.isArray(tags) ? tags : [];
  const updated = await prisma.article.update({
    where: { slug: params.slug },
    data: {
      title: title ?? undefined,
      subtitle: subtitle ?? undefined,
      content: content ?? undefined,
      excerpt: excerpt ?? undefined,
      coverImage: coverImage ?? undefined,
      published: typeof published === "boolean" ? published : undefined,
      publishedAt: typeof published === "boolean" ? (published ? new Date() : null) : undefined,
      tags: tagNames.length
        ? {
            deleteMany: {},
            create: await Promise.all(
              tagNames.map(async (name) => {
                const tag = await prisma.tag.upsert({
                  where: { name },
                  update: {},
                  create: { name },
                });
                return { tagId: tag.id };
              })
            ),
          }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(updated);
}
