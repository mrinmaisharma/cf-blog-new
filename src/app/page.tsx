import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: {
      author: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Medium Clone</h1>

      <div className="space-y-6">
        {articles.map((a) => (
          <article key={a.id} className="border-b pb-4">
            <Link
              href={`/p/${a.slug}`}
              className="text-xl font-semibold hover:underline"
            >
              {a.title}
            </Link>
            <div className="text-sm opacity-70 mt-1">
              by{" "}
              <Link href={`/u/${a.author.id}`} className="hover:underline">
                {a.author.name ?? "Unknown"}
              </Link>
            </div>
            <p className="mt-2">{a.excerpt ?? ""}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {a.tags.map((t) => (
                <span
                  key={t.tagId}
                  className="text-xs px-2 py-1 rounded border"
                >
                  {t.tag.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
