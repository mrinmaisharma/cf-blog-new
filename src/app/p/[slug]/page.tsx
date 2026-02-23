import { prisma } from "@/lib/prisma";
import { renderTiptap } from "@/lib/tiptap-render";
import Link from "next/link";
import ArticleContent from "@/components/post/ArticleContent";

export default async function PublicArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const a = await prisma.article.findFirst({
    where: { slug, published: true },
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

      <ArticleContent
        html={html}
        className="max-w-none text-[18px] leading-8 text-neutral-900 [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-5xl [&_h1]:font-extrabold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-4xl [&_h2]:font-bold [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:text-3xl [&_h3]:font-semibold [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-7 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-7 [&_li]:my-1.5 [&_ul.task-list]:my-4 [&_ul.task-list]:list-none [&_ul.task-list]:pl-0 [&_li.task-item]:my-2 [&_li.task-item]:list-none [&_li.task-item]:pl-0 [&_li.task-item>label]:inline-flex [&_li.task-item>label]:items-start [&_li.task-item>label]:gap-2 [&_li.task-item>label>input]:mt-1.5 [&_li.task-item>label>input]:accent-neutral-900 [&_li.task-item>label>span]:leading-7 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-neutral-300 [&_blockquote]:pl-5 [&_blockquote]:italic [&_img]:my-6 [&_img]:max-h-[560px] [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-neutral-200 [&_img]:object-cover [&_.youtube-embed]:my-6 [&_.youtube-embed]:overflow-hidden [&_.youtube-embed]:rounded-xl [&_.youtube-embed]:border [&_.youtube-embed]:border-neutral-200 [&_.youtube-embed_iframe]:aspect-video [&_.youtube-embed_iframe]:w-full [&_.youtube-embed_iframe]:border-0 [&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-neutral-950 [&_pre]:p-4 [&_pre]:text-neutral-100 [&_pre]:shadow-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[14px] [&_pre_code]:leading-6 [&_pre_code]:text-neutral-100 [&_pre_code]:font-mono [&_p_code]:rounded [&_p_code]:bg-neutral-100 [&_p_code]:px-1.5 [&_p_code]:py-0.5 [&_p_code]:font-mono [&_p_code]:text-[0.92em] [&_li_code]:rounded [&_li_code]:bg-neutral-100 [&_li_code]:px-1.5 [&_li_code]:py-0.5 [&_li_code]:font-mono [&_blockquote_code]:rounded [&_blockquote_code]:bg-neutral-100 [&_blockquote_code]:px-1.5 [&_blockquote_code]:py-0.5 [&_blockquote_code]:font-mono [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2 [&_hr]:my-8 [&_hr]:border-neutral-200"
      />
    </main>
  );
}
