"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function create() {
    setBusy(true);
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "Untitled" }),
    });

    if (res.status === 401) {
      router.push("/login?callbackUrl=/new");
      return;
    }

    const article = await res.json();
    router.push(`/edit/${article.slug}`);
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">New story</h1>
      <input
        className="border p-2 w-full"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="border px-4 py-2 rounded"
        onClick={create}
        disabled={busy}
      >
        {busy ? "Creating..." : "Create draft"}
      </button>
    </main>
  );
}
