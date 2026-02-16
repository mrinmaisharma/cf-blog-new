export function renderTiptap(node: any): string {
  if (!node) return "";

  function text(n: any): string {
    if (n.type === "text") {
      let t = escapeHtml(n.text || "");
      const marks = n.marks || [];
      for (const m of marks) {
        if (m.type === "bold") t = `<strong>${t}</strong>`;
        if (m.type === "italic") t = `<em>${t}</em>`;
        if (m.type === "code") t = `<code>${t}</code>`;
        if (m.type === "link")
          t = `<a href="${escapeAttr(m.attrs?.href || "#")}" rel="noreferrer">${t}</a>`;
      }
      return t;
    }
    return (n.content || []).map(text).join("");
  }

  function render(n: any): string {
    switch (n.type) {
      case "doc":
        return (n.content || []).map(render).join("");
      case "paragraph":
        return `<p>${(n.content || []).map(text).join("")}</p>`;
      case "heading":
        return `<h${n.attrs?.level || 2}>${(n.content || []).map(text).join("")}</h${n.attrs?.level || 2}>`;
      case "bulletList":
        return `<ul>${(n.content || []).map(render).join("")}</ul>`;
      case "orderedList":
        return `<ol>${(n.content || []).map(render).join("")}</ol>`;
      case "listItem":
        return `<li>${(n.content || []).map(render).join("")}</li>`;
      case "blockquote":
        return `<blockquote>${(n.content || []).map(render).join("")}</blockquote>`;
      case "codeBlock":
        return `<pre><code>${escapeHtml(n.content?.map((x: any) => x.text).join("") || "")}</code></pre>`;
      default:
        // fallback: render children
        return (n.content || []).map(render).join("");
    }
  }

  return render(node);
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
