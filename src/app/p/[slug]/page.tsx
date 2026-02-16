import { prisma } from "@/lib/prisma";
import { renderTiptap } from "@/lib/tiptap-render";
import Link from "next/link";

export default async function PublicArticle({
  params,
}: {
  params: { slug: string };
}) {
  const a = await prisma.article.findFirst({
    where: { slug: params.slug, published: true },
    include: {
      author: { select: { id: true, name: true, bio: true } },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!a) return <main className="max-w-3xl mx-auto p-6">Not found.</main>;

  const html = renderTiptap(a.content);

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-4xl font-bold">{a.title}</h1>
      {a.subtitle && <p className="text-lg opacity-80">{a.subtitle}</p>}

      <div className="text-sm opacity-70">
        by{" "}
        <Link className="underline" href={`/u/${a.author.id}`}>
          {a.author.name ?? "Unknown"}
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {a.tags.map((t) => (
          <Link
            key={t.tagId}
            href={`/tag/${encodeURIComponent(t.tag.name)}`}
            className="text-xs px-2 py-1 border rounded"
          >
            {t.tag.name}
          </Link>
        ))}
      </div>

      <div className="text-sm opacity-70">
        {a._count.likes} likes · {a._count.comments} comments
      </div>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </main>
  );
}
