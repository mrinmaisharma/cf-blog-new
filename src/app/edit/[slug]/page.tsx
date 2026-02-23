// src/app/edit/[slug]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Editor from "@/components/Editor";
// import { Editor } from "novel";

type ArticleDTO = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string | null;
  coverImage: string | null;
  content: any;
  published: boolean;
  tags?: { tag: { name: string } }[]; // from include { tags: { include: { tag: true } } }
};

function normalizeTags(raw?: ArticleDTO["tags"]) {
  if (!raw) return [];
  return raw.map((x) => x.tag?.name).filter(Boolean) as string[];
}

function uniqTags(tags: string[]) {
  const set = new Set<string>();
  for (const t of tags) {
    const v = t.trim();
    if (!v) continue;
    set.add(v);
  }
  return Array.from(set);
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState<any>({ type: "doc", content: [] });
  const [published, setPublished] = useState(false);

  // Tags UX: comma-separated input + chips
  const [tagInput, setTagInput] = useState("");
  const tags = useMemo(() => {
    const typed = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return uniqTags(typed);
  }, [tagInput]);

  useEffect(() => {
    if (!slug) return;
    let alive = true;

    async function load() {
      setLoading(true);
      setStatusMsg(null);

      const res = await fetch(`/api/articles/${slug}`, {
        method: "GET",
      });

      if (res.status === 401) {
        router.push(
          `/login?callbackUrl=${encodeURIComponent(`/edit/${slug}`)}`,
        );
        return;
      }

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error ?? "Failed to load article");
      }

      const a: ArticleDTO = await res.json();

      if (!alive) return;

      setTitle(a.title ?? "");
      setSubtitle(a.subtitle ?? "");
      setExcerpt(a.excerpt ?? "");
      setCoverImage(a.coverImage ?? "");
      setContent(a.content ?? { type: "doc", content: [] });
      setPublished(!!a.published);

      const t = normalizeTags(a.tags);
      setTagInput(t.join(", "));

      setLoading(false);
    }

    load().catch((e) => {
      if (!alive) return;
      setLoading(false);
      setStatusMsg(e?.message ?? "Error");
    });

    return () => {
      alive = false;
    };
  }, [slug, router]);

  async function save({
    redirectToPublic = false,
  }: { redirectToPublic?: boolean } = {}) {
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      title: title.trim() || "Untitled",
      subtitle: subtitle.trim() || null,
      excerpt: excerpt.trim() || null,
      coverImage: coverImage.trim() || null,
      content,
      published,
      tags, // array of strings
    };

    const res = await fetch(`/api/articles/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/edit/${slug}`)}`);
      return;
    }

    const j = await res.json().catch(() => ({}));

    if (!res.ok) {
      setSaving(false);
      setStatusMsg(j?.error ?? "Save failed");
      return;
    }

    setSaving(false);
    setStatusMsg("Saved ✅");

    // API returns updated article; use slug from response in case you later change it
    const updatedSlug = j?.slug ?? slug;

    if (redirectToPublic) {
      router.push(`/p/${updatedSlug}`);
      return;
    }

    // Refresh route data if needed
    router.refresh();
  }

  async function publishNow() {
    setPublished(true);
    await save({ redirectToPublic: true });
  }

  async function unpublishNow() {
    setPublished(false);
    await save();
  }

  if (loading) {
    return <main className="max-w-4xl mx-auto p-6">Loading…</main>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Edit story</h1>
          <p className="text-sm opacity-70">
            Slug: <span className="font-mono">{slug}</span>
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          <button
            className="border px-4 py-2 rounded"
            onClick={() => save()}
            disabled={saving}
            title="Save draft changes"
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            className="border px-4 py-2 rounded"
            onClick={() => router.push(`/p/${slug}`)}
            title="Preview public page (only works if published)"
          >
            Preview
          </button>

          {published ? (
            <button
              className="border px-4 py-2 rounded"
              onClick={unpublishNow}
              disabled={saving}
              title="Unpublish the story"
            >
              Unpublish
            </button>
          ) : (
            <button
              className="border px-4 py-2 rounded"
              onClick={publishNow}
              disabled={saving}
              title="Publish the story"
            >
              Publish
            </button>
          )}
        </div>
      </div>

      {statusMsg && <p className="text-sm">{statusMsg}</p>}

      {/* Title */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Title</label>
        <input
          className="w-full text-3xl font-bold outline-none border-b pb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Write a great title…"
        />
      </section>

      {/* Subtitle */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Subtitle</label>
        <input
          className="w-full border p-2 rounded outline-none"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Optional subtitle…"
        />
      </section>

      {/* Excerpt */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Excerpt</label>
        <textarea
          className="w-full border p-2 rounded outline-none"
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown in feeds…"
        />
        <p className="text-xs opacity-70">Tip: Keep it ~140–200 characters.</p>
      </section>

      {/* Cover Image */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Cover image URL</label>
        <input
          className="w-full border p-2 rounded outline-none"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://…"
        />
        {coverImage?.trim() && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.trim()}
            alt="Cover preview"
            className="w-full max-h-80 object-cover rounded border"
          />
        )}
      </section>

      {/* Tags */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Tags</label>
        <input
          className="w-full border p-2 rounded outline-none"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="e.g. nextjs, mysql, prisma"
        />
        <div className="flex gap-2 flex-wrap">
          {tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 rounded border">
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs opacity-70">
          Comma-separated. Example:{" "}
          <span className="font-mono">nextjs, mysql, prisma</span>
        </p>
      </section>

      {/* Editor */}
      <section className="space-y-2">
        <label className="text-sm font-semibold">Story</label>
        {/* <Editor value={content} onChange={setContent} /> */}
        <Editor value={content} onChange={setContent} />
      </section>

      {/* Publish toggle */}
      <section className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className="text-sm">
          Published
        </label>
        <span className="text-xs opacity-70">
          (Publishing will make it visible at{" "}
          <span className="font-mono">/p/{slug}</span>)
        </span>
      </section>

      {/* Bottom actions */}
      <section className="flex gap-2">
        <button
          className="border px-4 py-2 rounded"
          onClick={() => save()}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {!published ? (
          <button
            className="border px-4 py-2 rounded"
            onClick={publishNow}
            disabled={saving}
          >
            Publish & View
          </button>
        ) : (
          <button
            className="border px-4 py-2 rounded"
            onClick={() => router.push(`/p/${slug}`)}
          >
            View public page
          </button>
        )}
      </section>
    </main>
  );
}
