type TiptapMark = {
  type?: string;
  attrs?: Record<string, unknown>;
};

type TiptapNode = {
  type?: string;
  text?: string;
  marks?: TiptapMark[];
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
};

export function renderTiptap(node: TiptapNode | null | undefined): string {
  if (!node) return "";

  function renderTextNode(n: TiptapNode): string {
    if (n.type === "hardBreak") return "<br />";

    if (n.type === "text") {
      let out = escapeHtml(n.text || "");
      const marks = n.marks || [];

      for (const mark of marks) {
        if (mark.type === "bold") out = `<strong>${out}</strong>`;
        if (mark.type === "italic") out = `<em>${out}</em>`;
        if (mark.type === "strike") out = `<s>${out}</s>`;
        if (mark.type === "code") out = `<code>${out}</code>`;
        if (mark.type === "underline") out = `<u>${out}</u>`;
        if (mark.type === "link") {
          const href = sanitizeUrl(asString(mark.attrs?.href));
          out = `<a href="${escapeAttr(href || "#")}" rel="noopener noreferrer nofollow" target="_blank">${out}</a>`;
        }
      }

      return out;
    }

    return renderInline(n.content);
  }

  function renderInline(nodes?: TiptapNode[]): string {
    if (!nodes?.length) return "";
    return nodes.map(renderTextNode).join("");
  }

  function renderNode(n: TiptapNode): string {
    switch (n.type) {
      case "doc":
        return (n.content || []).map(renderNode).join("");
      case "paragraph":
        return `<p>${renderInline(n.content)}</p>`;
      case "heading": {
        const level = Number(n.attrs?.level);
        const safeLevel = [1, 2, 3, 4, 5, 6].includes(level) ? level : 2;
        return `<h${safeLevel}>${renderInline(n.content)}</h${safeLevel}>`;
      }
      case "bulletList":
        return `<ul>${(n.content || []).map(renderNode).join("")}</ul>`;
      case "orderedList":
        return `<ol>${(n.content || []).map(renderNode).join("")}</ol>`;
      case "listItem":
        return `<li>${(n.content || []).map(renderNode).join("")}</li>`;
      case "taskList":
        return `<ul class="task-list">${(n.content || []).map(renderNode).join("")}</ul>`;
      case "taskItem": {
        const checked = Boolean(n.attrs?.checked);
        return `<li class="task-item"><label><input type="checkbox" disabled ${checked ? "checked" : ""} /><span>${renderTaskItemContent(n.content)}</span></label></li>`;
      }
      case "blockquote":
        return `<blockquote>${(n.content || []).map(renderNode).join("")}</blockquote>`;
      case "codeBlock":
        return `<pre><code>${extractPlainText(n.content)}</code></pre>`;
      case "horizontalRule":
        return "<hr />";
      case "image": {
        const src = sanitizeUrl(asString(n.attrs?.src));
        if (!src) return "";
        const alt = asString(n.attrs?.alt) || "";
        return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" />`;
      }
      case "youtube": {
        const src = asString(n.attrs?.src);
        const embed = toYoutubeEmbedUrl(src);
        if (!embed) return "";
        return `<div class="youtube-embed"><iframe src="${escapeAttr(embed)}" title="YouTube video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`;
      }
      default:
        return (n.content || []).map(renderNode).join("");
    }
  }

  return renderNode(node);
}

function renderTaskItemContent(nodes?: TiptapNode[]): string {
  if (!nodes?.length) return "";

  return nodes
    .map((n) => {
      if (n.type === "paragraph") {
        return renderTaskInline(n.content);
      }
      if (n.type === "text") return applyTaskMarks(escapeHtml(n.text || ""), n.marks);
      if (n.type === "hardBreak") return "<br />";
      return renderTaskInline(n.content);
    })
    .join("");
}

function renderTaskInline(nodes?: TiptapNode[]): string {
  if (!nodes?.length) return "";

  return nodes
    .map((n) => {
      if (n.type === "text") return applyTaskMarks(escapeHtml(n.text || ""), n.marks);
      if (n.type === "hardBreak") return "<br />";
      return renderTaskInline(n.content);
    })
    .join("");
}

function applyTaskMarks(text: string, marks?: TiptapMark[]): string {
  let out = text;

  for (const mark of marks || []) {
    if (mark.type === "bold") out = `<strong>${out}</strong>`;
    if (mark.type === "italic") out = `<em>${out}</em>`;
    if (mark.type === "strike") out = `<s>${out}</s>`;
    if (mark.type === "code") out = `<code>${out}</code>`;
    if (mark.type === "underline") out = `<u>${out}</u>`;
    if (mark.type === "link") {
      const href = sanitizeUrl(asString(mark.attrs?.href));
      out = `<a href="${escapeAttr(href || "#")}" rel="noopener noreferrer nofollow" target="_blank">${out}</a>`;
    }
  }

  return out;
}

function extractPlainText(nodes?: TiptapNode[]): string {
  if (!nodes?.length) return "";

  return escapeHtml(
    nodes
      .map((n) => {
        if (n.type === "text") return n.text || "";
        if (n.type === "hardBreak") return "\n";
        return extractPlainText(n.content);
      })
      .join(""),
  );
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function sanitizeUrl(url: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

function toYoutubeEmbedUrl(url: string): string | null {
  const safe = sanitizeUrl(url);
  if (!safe) return null;

  try {
    const parsed = new URL(safe);
    const host = parsed.hostname.replace(/^www\./, "");

    let id = "";

    if (host === "youtu.be") {
      id = parsed.pathname.split("/").filter(Boolean)[0] || "";
    } else if (host.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/")[2] || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        id = parsed.pathname.split("/")[2] || "";
      }
    }

    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`;
  } catch {
    return null;
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function escapeAttr(s: string) {
  return escapeHtml(s).replaceAll("'", "&#39;");
}
