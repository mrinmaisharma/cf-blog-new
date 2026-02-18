import ArticleCard1 from "@/components/post/ArticleCard1";
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
    <main className="px-20">
      <div className="grid grid-cols-3 gap-0 border-b border-gray-300">
        <div className="col-span-2 pr-8 border-r border-gray-300 pb-10">
          <ArticleCard1 article={articles[0]} />
        </div>
        <div className="flex flex-col justify-start pr-5 pl-8 gap-3">
          <ArticleCard1 article={articles[1]} size="sm" />
          <ArticleCard1 article={articles[2]} size="sm" />
        </div>
      </div>

      <div className="space-y-6 hidden">
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
